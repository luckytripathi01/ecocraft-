from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import bcrypt
import secrets
from datetime import datetime, timedelta
import aiosmtplib
from email.message import EmailMessage

from database import get_connection
from config import Config

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


async def send_reset_email(email: str, token: str):
    reset_link = f"http://127.0.0.1:8081/reset-password?token={token}"

    message = EmailMessage()
    message["From"] = Config.SMTP_USERNAME
    message["To"] = email
    message["Subject"] = "EcoCraft Password Reset"

    message.set_content(
        f"""
Hello,

We received a request to reset your EcoCraft password.

Click the link below to reset your password:

{reset_link}

This link will expire in 15 minutes.

If you did not request a password reset, please ignore this email.

Regards,
EcoCraft Team
"""
    )

    await aiosmtplib.send(
        message,
        hostname=Config.SMTP_HOST,
        port=Config.SMTP_PORT,
        username=Config.SMTP_USERNAME,
        password=Config.SMTP_PASSWORD,
        start_tls=True,
    )


@router.post("/signup")
def signup(data: SignupRequest):
    db = get_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s",
            (data.email,)
        )

        if cursor.fetchone():
            raise HTTPException(
                status_code=409,
                detail="Email already registered"
            )

        password_hash = bcrypt.hashpw(
            data.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        cursor.execute(
            """
            INSERT INTO users
            (name, email, phone, password_hash)
            VALUES (%s, %s, %s, %s)
            """,
            (
                data.name,
                data.email,
                data.phone,
                password_hash
            )
        )

        db.commit()

        return {
            "success": True,
            "message": "Account created successfully",
            "user_id": cursor.lastrowid
        }

    finally:
        cursor.close()
        db.close()


@router.post("/login")
def login(data: LoginRequest):
    db = get_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT user_id, name, email, phone, password_hash, role
            FROM users
            WHERE email = %s
            """,
            (data.email,)
        )

        user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        password_correct = bcrypt.checkpw(
            data.password.encode("utf-8"),
            user["password_hash"].encode("utf-8")
        )

        if not password_correct:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "role": user["role"]
            }
        }

    finally:
        cursor.close()
        db.close()


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    db = get_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s",
            (data.email,)
        )

        user = cursor.fetchone()

        # Security: don't reveal whether email exists
        if not user:
            return {
                "success": True,
                "message": "If this email is registered, a reset link has been sent."
            }

        token = secrets.token_urlsafe(32)
        expires_at = datetime.now() + timedelta(minutes=15)

        cursor.execute(
            """
            UPDATE password_reset_tokens
            SET used = 1
            WHERE user_id = %s AND used = 0
            """,
            (user["user_id"],)
        )

        cursor.execute(
            """
            INSERT INTO password_reset_tokens
            (user_id, token, expires_at)
            VALUES (%s, %s, %s)
            """,
            (
                user["user_id"],
                token,
                expires_at
            )
        )

        db.commit()

        await send_reset_email(data.email, token)

        return {
            "success": True,
            "message": "If this email is registered, a reset link has been sent."
        }

    finally:
        cursor.close()
        db.close()


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    db = get_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, user_id, expires_at, used
            FROM password_reset_tokens
            WHERE token = %s
            """,
            (data.token,)
        )

        reset_token = cursor.fetchone()

        if not reset_token:
            raise HTTPException(
                status_code=400,
                detail="Invalid reset token"
            )

        if reset_token["used"]:
            raise HTTPException(
                status_code=400,
                detail="Reset token has already been used"
            )

        if datetime.now() > reset_token["expires_at"]:
            raise HTTPException(
                status_code=400,
                detail="Reset token has expired"
            )

        if len(data.new_password) < 8:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters"
            )

        password_hash = bcrypt.hashpw(
            data.new_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        cursor.execute(
            """
            UPDATE users
            SET password_hash = %s
            WHERE user_id = %s
            """,
            (
                password_hash,
                reset_token["user_id"]
            )
        )

        cursor.execute(
            """
            UPDATE password_reset_tokens
            SET used = 1
            WHERE id = %s
            """,
            (reset_token["id"],)
        )

        db.commit()

        return {
            "success": True,
            "message": "Password reset successfully"
        }

    finally:
        cursor.close()
        db.close()