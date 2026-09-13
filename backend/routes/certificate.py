from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from services.certificate_service import (
    get_user_xp,
    calculate_tier,
    get_user_details,
    get_certificate,
    generate_certificate_pdf
)

from database import get_connection

from datetime import datetime
import uuid
import os


router = APIRouter(
    prefix="/certificate",
    tags=["Certificate"]
)


# ============================================================
# CHECK CERTIFICATE ELIGIBILITY
# ============================================================

@router.get("/eligibility/{user_id}")
def certificate_eligibility(user_id: int):

    user = get_user_details(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    xp = get_user_xp(user_id)
    tier = calculate_tier(xp)

    return {
        "status": "success",
        "user_id": user_id,
        "user_name": user["name"],
        "xp": xp,
        "tier": tier,
        "eligible": True
    }


# ============================================================
# GENERATE CERTIFICATE
# ============================================================

@router.post("/generate/{user_id}")
def generate_certificate(user_id: int):

    # --------------------------------------------------------
    # Get actual user from database
    # --------------------------------------------------------

    user = get_user_details(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------------------------------
    # Get latest XP
    # --------------------------------------------------------

    xp = get_user_xp(user_id)

    # --------------------------------------------------------
    # Automatically calculate tier
    # --------------------------------------------------------

    tier = calculate_tier(xp)

    # --------------------------------------------------------
    # Prevent duplicate certificate
    # --------------------------------------------------------

    existing_certificate = get_certificate(user_id)

    if existing_certificate:

        return {
            "status": "already_exists",
            "message": "Certificate already generated.",
            "certificate": existing_certificate
        }

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # ----------------------------------------------------
        # Generate verification code
        # ----------------------------------------------------

        verification_code = str(uuid.uuid4())

        # ----------------------------------------------------
        # Temporary certificate number
        # ----------------------------------------------------

        cursor.execute(
            """
            INSERT INTO certificates
            (
                user_id,
                certificate_number,
                user_name,
                tier,
                xp,
                issue_date,
                verification_code
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                user_id,
                "TEMP",
                user["name"],
                tier,
                xp,
                datetime.now(),
                verification_code
            )
        )

        certificate_id = cursor.lastrowid

        # ----------------------------------------------------
        # Generate unique certificate number
        # ----------------------------------------------------

        certificate_number = (
            f"ECO-{datetime.now().year}-"
            f"{certificate_id:05d}"
        )

        # ----------------------------------------------------
        # Update certificate number
        # ----------------------------------------------------

        cursor.execute(
            """
            UPDATE certificates
            SET certificate_number = %s
            WHERE certificate_id = %s
            """,
            (
                certificate_number,
                certificate_id
            )
        )

        connection.commit()

        # ----------------------------------------------------
        # Generate premium tier-specific PDF
        # ----------------------------------------------------

        issue_date = datetime.now()

        pdf_path = generate_certificate_pdf(
            certificate_number=certificate_number,
            user_name=user["name"],
            tier=tier,
            xp=xp,
            issue_date=issue_date,
            verification_code=verification_code
        )

        return {
            "status": "success",
            "message": "Certificate generated successfully.",
            "certificate": {
                "certificate_id": certificate_id,
                "user_id": user_id,
                "certificate_number": certificate_number,
                "user_name": user["name"],
                "tier": tier,
                "xp": xp,
                "issue_date": issue_date,
                "verification_code": verification_code,
                "pdf_path": pdf_path
            }
        }

    except Exception as e:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Certificate generation failed: {str(e)}"
        )

    finally:

        cursor.close()
        connection.close()


# ============================================================
# REGENERATE EXISTING CERTIFICATE PDF
# ============================================================

@router.post("/regenerate/{user_id}")
def regenerate_certificate(user_id: int):

    # --------------------------------------------------------
    # Get actual user
    # --------------------------------------------------------

    user = get_user_details(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------------------------------
    # Get existing certificate
    # --------------------------------------------------------

    certificate = get_certificate(user_id)

    if not certificate:

        raise HTTPException(
            status_code=404,
            detail="No certificate found. Generate certificate first."
        )

    # --------------------------------------------------------
    # Get latest XP
    # --------------------------------------------------------

    xp = get_user_xp(user_id)

    # --------------------------------------------------------
    # Automatically calculate current tier
    # --------------------------------------------------------

    tier = calculate_tier(xp)

    certificate_number = certificate["certificate_number"]

    try:

        # ----------------------------------------------------
        # Generate QR + premium PDF
        # ----------------------------------------------------

        pdf_path = generate_certificate_pdf(
            certificate_number=certificate_number,
            user_name=user["name"],
            tier=tier,
            xp=xp,
            issue_date=certificate["issue_date"],
            verification_code=certificate["verification_code"]
        )

        # ----------------------------------------------------
        # Update database with latest information
        # ----------------------------------------------------

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE certificates
            SET user_name = %s,
                tier = %s,
                xp = %s
            WHERE certificate_id = %s
            """,
            (
                user["name"],
                tier,
                xp,
                certificate["certificate_id"]
            )
        )

        connection.commit()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "message": "Certificate PDF regenerated successfully.",
            "certificate_id": certificate["certificate_id"],
            "certificate_number": certificate_number,
            "user_name": user["name"],
            "tier": tier,
            "xp": xp,
            "pdf_path": pdf_path
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Certificate regeneration failed: {str(e)}"
        )


# ============================================================
# DOWNLOAD CERTIFICATE
# ============================================================

@router.get("/download/{certificate_number}")
def download_certificate(certificate_number: str):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT *
            FROM certificates
            WHERE certificate_number = %s
            """,
            (certificate_number,)
        )

        certificate = cursor.fetchone()

    finally:

        cursor.close()
        connection.close()

    if not certificate:

        raise HTTPException(
            status_code=404,
            detail="Certificate not found."
        )

    # --------------------------------------------------------
    # Find generated PDF
    # --------------------------------------------------------

    base_dir = os.path.dirname(
        os.path.dirname(__file__)
    )

    pdf_path = os.path.join(
        base_dir,
        "generated_certificates",
        f"{certificate_number}.pdf"
    )

    if not os.path.exists(pdf_path):

        raise HTTPException(
            status_code=404,
            detail="Certificate PDF file not found."
        )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"{certificate_number}.pdf",
        headers={
            "Content-Disposition":
                f'inline; filename="{certificate_number}.pdf"'
        }
    )


# ============================================================
# GET USER CERTIFICATE
# ============================================================

@router.get("/my-certificate/{user_id}")
def my_certificate(user_id: int):

    certificate = get_certificate(user_id)

    if not certificate:

        return {
            "status": "not_found",
            "message": "No certificate generated yet."
        }

    return {
        "status": "success",
        "certificate": certificate
    }


# ============================================================
# VERIFY CERTIFICATE
# ============================================================

@router.get("/verify/{certificate_number}")
def verify_certificate(certificate_number: str):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                certificate_id,
                user_id,
                certificate_number,
                user_name,
                tier,
                xp,
                issue_date,
                verification_code
            FROM certificates
            WHERE certificate_number = %s
            """,
            (certificate_number,)
        )

        certificate = cursor.fetchone()

    finally:

        cursor.close()
        connection.close()

    # --------------------------------------------------------
    # Invalid certificate
    # --------------------------------------------------------

    if not certificate:

        return {
            "status": "invalid",
            "verified": False,
            "message": "Certificate not found."
        }

    # --------------------------------------------------------
    # Valid certificate
    # --------------------------------------------------------

    return {
        "status": "success",
        "verified": True,
        "message": "Certificate is valid.",
        "certificate": {
            "certificate_id":
                certificate["certificate_id"],

            "user_id":
                certificate["user_id"],

            "certificate_number":
                certificate["certificate_number"],

            "user_name":
                certificate["user_name"],

            "tier":
                certificate["tier"],

            "xp":
                certificate["xp"],

            "issue_date":
                certificate["issue_date"],

            "verification_code":
                certificate["verification_code"]
        }
    }