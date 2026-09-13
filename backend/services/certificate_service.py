# backend/services/certificate_service.py

import os
import uuid
import math
from datetime import datetime

import qrcode

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

from database import get_connection


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

GENERATED_DIR = os.path.join(
    BASE_DIR,
    "generated_certificates"
)

QR_DIR = os.path.join(
    GENERATED_DIR,
    "qr"
)

os.makedirs(GENERATED_DIR, exist_ok=True)
os.makedirs(QR_DIR, exist_ok=True)


VERIFY_BASE_URL = os.getenv(
    "VERIFY_BASE_URL",
    "http://127.0.0.1:8000"
)


# =========================================================
# TIER CONFIGURATION
# =========================================================

TIER_CONFIG = {

    "Bronze": {
        "min_xp": 0,
        "max_xp": 99,

        "bg": colors.HexColor("#F4E5D0"),
        "border": colors.HexColor("#9A5B32"),
        "dark": colors.HexColor("#57351F"),
        "accent": colors.HexColor("#B87333"),
        "light": colors.HexColor("#E7C49F"),

        "range": "0–99 XP",
        "title": "BRONZE MEMBER CERTIFICATE",
        "subtitle": "EcoCraft Member Program",
    },

    "Silver": {
        "min_xp": 100,
        "max_xp": 499,

        "bg": colors.HexColor("#ECEDEF"),
        "border": colors.HexColor("#747A80"),
        "dark": colors.HexColor("#22262A"),
        "accent": colors.HexColor("#AEB5BC"),
        "light": colors.HexColor("#DDE1E5"),

        "range": "100–499 XP",
        "title": "SILVER MEMBER CERTIFICATE",
        "subtitle": "EcoCraft Member Program",
    },

    "Gold": {
        "min_xp": 500,
        "max_xp": 1499,

        "bg": colors.HexColor("#302716"),
        "border": colors.HexColor("#C59B3B"),
        "dark": colors.HexColor("#F0D58A"),
        "accent": colors.HexColor("#D4AF37"),
        "light": colors.HexColor("#8D6B22"),

        "range": "500–1499 XP",
        "title": "GOLD MEMBER CERTIFICATE",
        "subtitle": "EcoCraft Member Program",
    },

    "Diamond": {
        "min_xp": 1500,
        "max_xp": None,

        "bg": colors.HexColor("#EEF3F7"),
        "border": colors.HexColor("#7E8B98"),
        "dark": colors.HexColor("#1D252D"),
        "accent": colors.HexColor("#A9CFF2"),
        "light": colors.HexColor("#DCEBFA"),

        "range": "1500+ XP",
        "title": "DIAMOND MEMBER CERTIFICATE",
        "subtitle": "EcoCraft Member Program",
    }
}


# =========================================================
# DATABASE HELPERS
# =========================================================

def get_user_details(user_id: int):

    conn = get_connection()

    try:
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT user_id, name, email
            FROM users
            WHERE user_id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            raise ValueError(
                f"User with ID {user_id} not found."
            )

        return user

    finally:
        cursor.close()
        conn.close()


def get_user_xp(user_id: int):

    conn = get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COALESCE(SUM(xp_earned), 0)
            FROM xp_transactions
            WHERE user_id = %s
            """,
            (user_id,)
        )

        result = cursor.fetchone()

        return int(result[0] or 0)

    finally:
        cursor.close()
        conn.close()


# =========================================================
# TIER CALCULATION
# =========================================================

def calculate_tier(xp: int) -> str:

    xp = int(xp)

    if xp < 100:
        return "Bronze"

    elif xp < 500:
        return "Silver"

    elif xp < 1500:
        return "Gold"

    else:
        return "Diamond"


# =========================================================
# EXISTING CERTIFICATE
# =========================================================

def get_certificate(user_id: int):

    conn = get_connection()

    try:
        cursor = conn.cursor(dictionary=True)

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
            WHERE user_id = %s
            ORDER BY certificate_id DESC
            LIMIT 1
            """,
            (user_id,)
        )

        return cursor.fetchone()

    finally:
        cursor.close()
        conn.close()


# =========================================================
# CERTIFICATE NUMBER
# =========================================================

def generate_certificate_number():

    conn = get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT certificate_id
            FROM certificates
            ORDER BY certificate_id DESC
            LIMIT 1
            """
        )

        result = cursor.fetchone()

        if result:
            next_id = int(result[0]) + 1
        else:
            next_id = 1

        year = datetime.now().year

        return f"ECO-{year}-{next_id:05d}"

    finally:
        cursor.close()
        conn.close()


# =========================================================
# SAVE CERTIFICATE
# =========================================================

def save_certificate(
    user_id: int,
    user_name: str,
    tier: str,
    xp: int
):

    certificate_number = generate_certificate_number()

    verification_code = str(uuid.uuid4())

    issue_date = datetime.now()

    conn = get_connection()

    try:
        cursor = conn.cursor()

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
            VALUES
            (
                %s, %s, %s, %s, %s, %s, %s
            )
            """,
            (
                user_id,
                certificate_number,
                user_name,
                tier,
                xp,
                issue_date,
                verification_code
            )
        )

        conn.commit()

        certificate_id = cursor.lastrowid

        return {
            "certificate_id": certificate_id,
            "user_id": user_id,
            "certificate_number": certificate_number,
            "user_name": user_name,
            "tier": tier,
            "xp": xp,
            "issue_date": issue_date,
            "verification_code": verification_code
        }

    finally:
        cursor.close()
        conn.close()


# =========================================================
# QR CODE
# =========================================================

def create_qr(certificate_number: str):

    verify_url = (
        f"{VERIFY_BASE_URL}"
        f"/certificate/verify/"
        f"{certificate_number}"
    )

    qr = qrcode.QRCode(
        version=4,
        box_size=8,
        border=2
    )

    qr.add_data(verify_url)
    qr.make(fit=True)

    image = qr.make_image(
        fill_color="black",
        back_color="white"
    )

    qr_path = os.path.join(
        QR_DIR,
        f"{certificate_number}.png"
    )

    image.save(qr_path)

    return qr_path


# =========================================================
# COMMON QR - TOP LEFT
# =========================================================

def draw_top_left_qr(
    c,
    certificate_number,
    cfg,
    width,
    height
):

    qr_path = create_qr(
        certificate_number
    )

    qr_size = 58

    qr_x = 48
    qr_y = height - 105

    c.setFillColor(colors.white)

    c.roundRect(
        qr_x - 5,
        qr_y - 5,
        qr_size + 10,
        qr_size + 10,
        5,
        fill=1,
        stroke=0
    )

    c.drawImage(
        ImageReader(qr_path),
        qr_x,
        qr_y,
        width=qr_size,
        height=qr_size,
        preserveAspectRatio=True,
        mask="auto"
    )

    c.setFillColor(cfg["dark"])

    c.setFont(
        "Helvetica-Bold",
        6
    )

    c.drawCentredString(
        qr_x + qr_size / 2,
        qr_y - 12,
        "SCAN TO VERIFY"
    )


# =========================================================
# COMMON BORDER
# =========================================================

def draw_double_border(c, width, height, cfg):

    c.setStrokeColor(cfg["border"])
    c.setLineWidth(5)

    c.roundRect(
        22,
        22,
        width - 44,
        height - 44,
        12,
        stroke=1,
        fill=0
    )

    c.setLineWidth(1.5)

    c.roundRect(
        35,
        35,
        width - 70,
        height - 70,
        8,
        stroke=1,
        fill=0
    )

    corner = 25

    positions = [
        (45, 45),
        (width - 45, 45),
        (45, height - 45),
        (width - 45, height - 45)
    ]

    for x, y in positions:

        c.setLineWidth(2)

        if x < width / 2:

            c.line(
                x,
                y,
                x + corner,
                y
            )

            c.line(
                x,
                y,
                x,
                y + corner if y < height / 2
                else y - corner
            )

        else:

            c.line(
                x,
                y,
                x - corner,
                y
            )

            c.line(
                x,
                y,
                x,
                y + corner if y < height / 2
                else y - corner
            )


# =========================================================
# HANGING ROPE
# =========================================================

def draw_hanging_rope(c, x, y, cfg):

    c.setStrokeColor(cfg["dark"])
    c.setLineWidth(2)

    c.line(
        x,
        y,
        x,
        y - 38
    )

    c.circle(
        x,
        y - 43,
        7,
        stroke=1,
        fill=0
    )

    c.setFillColor(cfg["accent"])

    p = c.beginPath()

    p.moveTo(
        x,
        y - 55
    )

    p.lineTo(
        x + 7,
        y - 63
    )

    p.lineTo(
        x,
        y - 71
    )

    p.lineTo(
        x - 7,
        y - 63
    )

    p.close()

    c.drawPath(
        p,
        stroke=1,
        fill=1
    )


# =========================================================
# BRONZE / GOLD MEDAL
# =========================================================

def draw_medal(c, x, y, tier, cfg):

    c.setFillColor(cfg["accent"])

    c.roundRect(
        x - 15,
        y + 45,
        12,
        48,
        3,
        fill=1,
        stroke=0
    )

    c.roundRect(
        x + 3,
        y + 45,
        12,
        48,
        3,
        fill=1,
        stroke=0
    )

    c.setFillColor(cfg["dark"])

    c.circle(
        x,
        y,
        55,
        fill=1,
        stroke=0
    )

    c.setFillColor(cfg["accent"])

    c.circle(
        x,
        y,
        47,
        fill=1,
        stroke=0
    )

    c.setFillColor(cfg["bg"])

    c.circle(
        x,
        y,
        38,
        fill=1,
        stroke=0
    )

    c.setFillColor(cfg["accent"])

    p = c.beginPath()

    points = []

    for i in range(10):

        angle = math.radians(
            90 + i * 36
        )

        radius = 22 if i % 2 == 0 else 9

        px = x + radius * math.cos(angle)
        py = y + radius * math.sin(angle)

        points.append(
            (px, py)
        )

    p.moveTo(
        points[0][0],
        points[0][1]
    )

    for px, py in points[1:]:

        p.lineTo(
            px,
            py
        )

    p.close()

    c.drawPath(
        p,
        stroke=0,
        fill=1
    )

    c.setFillColor(cfg["accent"])

    c.circle(
        x,
        y - 82,
        20,
        fill=1,
        stroke=0
    )

    c.setFillColor(cfg["bg"])

    c.circle(
        x,
        y - 82,
        15,
        fill=1,
        stroke=0
    )

    c.setFillColor(cfg["accent"])

    c.setFont(
        "Helvetica-Bold",
        8
    )

    c.drawCentredString(
        x,
        y - 85,
        tier.upper()
    )


# =========================================================
# PEN
# =========================================================

def draw_pen(c, x, y, cfg, reverse=False):

    c.saveState()

    c.setStrokeColor(cfg["accent"])
    c.setLineWidth(5)

    if reverse:

        c.line(
            x,
            y,
            x - 100,
            y + 50
        )

        c.setLineWidth(2)

        c.line(
            x - 100,
            y + 50,
            x - 120,
            y + 60
        )

    else:

        c.line(
            x,
            y,
            x + 100,
            y + 50
        )

        c.setLineWidth(2)

        c.line(
            x + 100,
            y + 50,
            x + 120,
            y + 60
        )

    c.restoreState()


# =========================================================
# SILVER MEDALLION
# =========================================================

def draw_silver_medallion(c, x, y):

    # Outer silver ring
    c.setFillColor(
        colors.HexColor("#BFC5CA")
    )

    c.setStrokeColor(
        colors.HexColor("#70777E")
    )

    c.setLineWidth(2)

    c.circle(
        x,
        y,
        55,
        fill=1,
        stroke=1
    )

    # Inner silver ring
    c.setFillColor(
        colors.HexColor("#E7EAED")
    )

    c.setStrokeColor(
        colors.HexColor("#8A9198")
    )

    c.setLineWidth(1.5)

    c.circle(
        x,
        y,
        47,
        fill=1,
        stroke=1
    )

    # Inner face
    c.setFillColor(
        colors.HexColor("#F4F5F6")
    )

    c.setStrokeColor(
        colors.HexColor("#6F767D")
    )

    c.circle(
        x,
        y,
        38,
        fill=1,
        stroke=1
    )

    # Silver star
    c.setFillColor(
        colors.HexColor("#8A9299")
    )

    p = c.beginPath()

    points = []

    for i in range(10):

        angle = math.radians(
            90 + i * 36
        )

        radius = 22 if i % 2 == 0 else 9

        px = x + radius * math.cos(angle)
        py = y + radius * math.sin(angle)

        points.append(
            (px, py)
        )

    p.moveTo(
        points[0][0],
        points[0][1]
    )

    for px, py in points[1:]:

        p.lineTo(
            px,
            py
        )

    p.close()

    c.drawPath(
        p,
        stroke=0,
        fill=1
    )

    # Bottom silver badge
    c.setFillColor(
        colors.HexColor("#AEB5BC")
    )

    c.circle(
        x,
        y - 82,
        20,
        fill=1,
        stroke=0
    )

    c.setFillColor(
        colors.HexColor("#F4F5F6")
    )

    c.circle(
        x,
        y - 82,
        15,
        fill=1,
        stroke=0
    )

    c.setFillColor(
        colors.HexColor("#70777E")
    )

    c.setFont(
        "Helvetica-Bold",
        8
    )

    c.drawCentredString(
        x,
        y - 85,
        "SILVER"
    )


# =========================================================
# SILVER CERTIFICATE
# SAME STRUCTURE AS BRONZE / GOLD
# =========================================================

def draw_silver_certificate(
    c,
    certificate_number,
    user_name,
    xp,
    issue_date,
    cfg,
    width,
    height
):

    # =====================================================
    # BACKGROUND
    # =====================================================

    c.setFillColor(
        cfg["bg"]
    )

    c.rect(
        0,
        0,
        width,
        height,
        fill=1,
        stroke=0
    )

    # subtle center panel
    c.setFillColor(
        colors.Color(
            cfg["bg"].red,
            cfg["bg"].green,
            cfg["bg"].blue,
            alpha=0.35
        )
    )

    c.roundRect(
        48,
        48,
        width - 96,
        height - 96,
        8,
        fill=1,
        stroke=0
    )

    # =====================================================
    # BORDERS
    # =====================================================

    draw_double_border(
        c,
        width,
        height,
        cfg
    )

    # =====================================================
    # TOP DECORATION
    # =====================================================

    draw_hanging_rope(
        c,
        85,
        height - 30,
        cfg
    )

    draw_hanging_rope(
        c,
        width - 85,
        height - 30,
        cfg
    )

    # =====================================================
    # ECOCRAFT
    # =====================================================

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawCentredString(
        width / 2,
        height - 67,
        "ECOCRAFT"
    )

    c.setFont(
        "Helvetica",
        6.5
    )

    c.drawCentredString(
        width / 2,
        height - 78,
        "TURNING WASTE INTO VALUE"
    )

    # =====================================================
    # TITLE
    # =====================================================

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Times-Bold",
        25
    )

    c.drawCentredString(
        width / 2,
        height - 115,
        cfg["title"]
    )

    c.setStrokeColor(
        cfg["accent"]
    )

    c.setLineWidth(1.5)

    c.line(
        width / 2 - 155,
        height - 128,
        width / 2 + 155,
        height - 128
    )

    c.setFont(
        "Times-Roman",
        12
    )

    c.drawCentredString(
        width / 2,
        height - 148,
        cfg["subtitle"]
    )

    # =====================================================
    # PRESENTED TO
    # =====================================================

    c.setFont(
        "Helvetica",
        9
    )

    c.setFillColor(
        cfg["dark"]
    )

    c.drawCentredString(
        width / 2,
        height - 185,
        "This certificate is awarded to:"
    )

    # =====================================================
    # USER NAME
    # =====================================================

    c.setFont(
        "Times-Italic",
        25
    )

    c.drawCentredString(
        width / 2,
        height - 220,
        user_name
    )

    c.setStrokeColor(
        cfg["border"]
    )

    c.setLineWidth(1)

    c.line(
        width / 2 - 150,
        height - 232,
        width / 2 + 150,
        height - 232
    )

    # =====================================================
    # LEFT DESCRIPTION
    # =====================================================

    left_x = 105
    text_y = height - 300

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        left_x,
        text_y,
        "This certificate is awarded to:"
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawString(
        left_x,
        text_y - 25,
        "EcoCraft Sustainability Member"
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        left_x,
        text_y - 48,
        f"For achieving {cfg['range']}"
    )

    c.drawString(
        left_x,
        text_y - 68,
        "through sustainable actions,"
    )

    c.drawString(
        left_x,
        text_y - 88,
        "waste awareness and creativity."
    )

    # =====================================================
    # SILVER MEDAL
    # =====================================================

    center_x = width / 2
    center_y = height / 2 - 38

    draw_silver_medallion(
        c,
        center_x,
        center_y
    )

    # =====================================================
    # RIGHT INFORMATION
    # =====================================================

    right_x = width - 265

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawString(
        right_x,
        text_y,
        "ACHIEVEMENT LEVEL"
    )

    c.setFont(
        "Times-Bold",
        19
    )

    c.drawString(
        right_x,
        text_y - 30,
        "SILVER"
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        right_x,
        text_y - 54,
        f"EcoPoints Earned: {xp}"
    )

    c.drawString(
        right_x,
        text_y - 75,
        f"XP Range: {cfg['range']}"
    )

    c.drawString(
        right_x,
        text_y - 96,
        "Sustainability Achievement"
    )

    # =====================================================
    # SIGNATURE SECTION
    # =====================================================

    signature_y = 95

    c.setStrokeColor(
        cfg["border"]
    )

    c.setLineWidth(1)

    c.line(
        100,
        signature_y,
        245,
        signature_y
    )

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica",
        8
    )

    c.drawCentredString(
        172,
        signature_y - 15,
        "ECOCRAFT TEAM"
    )

    c.setFont(
        "Helvetica-Bold",
        9
    )

    c.drawCentredString(
        172,
        signature_y + 7,
        "Authorized Signature"
    )

    c.line(
        width - 245,
        signature_y,
        width - 100,
        signature_y
    )

    c.setFont(
        "Helvetica",
        8
    )

    c.drawCentredString(
        width - 172,
        signature_y - 15,
        "ECOCRAFT"
    )

    c.setFont(
        "Helvetica-Bold",
        9
    )

    c.drawCentredString(
        width - 172,
        signature_y + 7,
        "Program Director"
    )

    # =====================================================
    # DATE
    # =====================================================

    c.setFont(
        "Helvetica-Bold",
        8
    )

    c.drawString(
        70,
        60,
        "ISSUE DATE"
    )

    c.setFont(
        "Helvetica",
        8
    )

    date_text = issue_date.strftime(
        "%d %B %Y"
    )

    c.drawString(
        70,
        47,
        date_text
    )

    # =====================================================
    # CERTIFICATE NUMBER
    # =====================================================

    c.setFont(
        "Helvetica-Bold",
        8
    )

    c.drawCentredString(
        width / 2,
        52,
        certificate_number
    )

    c.setFont(
        "Helvetica",
        6.5
    )

    c.drawCentredString(
        width / 2,
        42,
        "Official EcoCraft Certificate"
    )

    # =====================================================
    # QR
    # =====================================================

    draw_top_left_qr(
        c,
        certificate_number,
        cfg,
        width,
        height
    )

    # =====================================================
    # DECORATIVE PENS
    # =====================================================

    draw_pen(
        c,
        72,
        120,
        cfg,
        reverse=False
    )

    draw_pen(
        c,
        width - 72,
        120,
        cfg,
        reverse=True
    )


# =========================================================
# DIAMOND MEDALLION
# =========================================================

def draw_diamond_medallion(c, x, y):

    # Outer diamond glow
    c.setFillColor(
        colors.white
    )

    c.setStrokeColor(
        colors.HexColor("#8B939B")
    )

    c.setLineWidth(2)

    c.circle(
        x,
        y,
        58,
        fill=1,
        stroke=1
    )

    # Metallic ring
    c.setFillColor(
        colors.HexColor("#D6DADE")
    )

    c.setStrokeColor(
        colors.HexColor("#9CA4AB")
    )

    c.setLineWidth(1.5)

    c.circle(
        x,
        y,
        53,
        fill=1,
        stroke=1
    )

    # Inner jewel circle
    c.setFillColor(
        colors.HexColor("#EEF0F2")
    )

    c.setStrokeColor(
        colors.HexColor("#6D747B")
    )

    c.setLineWidth(2)

    c.circle(
        x,
        y,
        45,
        fill=1,
        stroke=1
    )

    c.setStrokeColor(
        colors.white
    )

    c.setLineWidth(1)

    c.circle(
        x,
        y,
        40,
        fill=0,
        stroke=1
    )

    # =====================================================
    # DIAMOND FLOWER / JEWEL
    # =====================================================

    c.setFillColor(
        colors.HexColor("#DCE1E5")
    )

    c.setStrokeColor(
        colors.HexColor("#717980")
    )

    c.setLineWidth(1.2)

    for angle in range(0, 360, 45):

        rad = math.radians(angle)

        px = x + math.cos(rad) * 13
        py = y + math.sin(rad) * 13

        c.saveState()

        c.translate(
            px,
            py
        )

        c.rotate(angle)

        c.ellipse(
            -4,
            -9,
            4,
            9,
            fill=1,
            stroke=1
        )

        c.restoreState()

    # =====================================================
    # CENTER DIAMOND
    # =====================================================

    c.setFillColor(
        colors.white
    )

    c.setStrokeColor(
        colors.HexColor("#777F87")
    )

    c.setLineWidth(1)

    p = c.beginPath()

    p.moveTo(
        x,
        y + 18
    )

    p.lineTo(
        x + 14,
        y + 5
    )

    p.lineTo(
        x + 8,
        y - 13
    )

    p.lineTo(
        x - 8,
        y - 13
    )

    p.lineTo(
        x - 14,
        y + 5
    )

    p.close()

    c.drawPath(
        p,
        fill=1,
        stroke=1
    )

    # Diamond facets
    c.setStrokeColor(
        colors.HexColor("#B7BEC5")
    )

    c.setLineWidth(0.8)

    c.line(
        x,
        y + 18,
        x,
        y - 13
    )

    c.line(
        x - 14,
        y + 5,
        x + 14,
        y + 5
    )

    c.line(
        x - 8,
        y - 13,
        x + 14,
        y + 5
    )

    c.line(
        x + 8,
        y - 13,
        x - 14,
        y + 5
    )

    # Center shine
    c.setFillColor(
        colors.white
    )

    c.setFont(
        "Helvetica-Bold",
        14
    )

    c.drawCentredString(
        x - 1,
        y + 4,
        "✦"
    )

    # =====================================================
    # SPARKLES
    # =====================================================

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawString(
        x - 48,
        y + 28,
        "✦"
    )

    c.drawString(
        x + 34,
        y + 28,
        "✦"
    )

    c.drawString(
        x + 38,
        y - 38,
        "✦"
    )


# =========================================================
# DIAMOND CERTIFICATE
# SAME STRUCTURE AS BRONZE / GOLD
# DIAMOND LOGO + SHINE
# =========================================================

def draw_diamond_certificate(
    c,
    certificate_number,
    user_name,
    xp,
    issue_date,
    cfg,
    width,
    height
):

    # =====================================================
    # BACKGROUND
    # =====================================================

    c.setFillColor(
        cfg["bg"]
    )

    c.rect(
        0,
        0,
        width,
        height,
        fill=1,
        stroke=0
    )

    # subtle center panel
    c.setFillColor(
        colors.Color(
            cfg["bg"].red,
            cfg["bg"].green,
            cfg["bg"].blue,
            alpha=0.35
        )
    )

    c.roundRect(
        48,
        48,
        width - 96,
        height - 96,
        8,
        fill=1,
        stroke=0
    )

    # =====================================================
    # BORDERS
    # =====================================================

    draw_double_border(
        c,
        width,
        height,
        cfg
    )

    # =====================================================
    # TOP DECORATION
    # =====================================================

    draw_hanging_rope(
        c,
        85,
        height - 30,
        cfg
    )

    draw_hanging_rope(
        c,
        width - 85,
        height - 30,
        cfg
    )

    # =====================================================
    # ECOCRAFT
    # =====================================================

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawCentredString(
        width / 2,
        height - 67,
        "ECOCRAFT"
    )

    c.setFont(
        "Helvetica",
        6.5
    )

    c.drawCentredString(
        width / 2,
        height - 78,
        "TURNING WASTE INTO VALUE"
    )

    # =====================================================
    # TITLE
    # =====================================================

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Times-Bold",
        25
    )

    c.drawCentredString(
        width / 2,
        height - 115,
        cfg["title"]
    )

    c.setStrokeColor(
        cfg["accent"]
    )

    c.setLineWidth(1.5)

    c.line(
        width / 2 - 155,
        height - 128,
        width / 2 + 155,
        height - 128
    )

    c.setFont(
        "Times-Roman",
        12
    )

    c.drawCentredString(
        width / 2,
        height - 148,
        cfg["subtitle"]
    )

    # =====================================================
    # PRESENTED TO
    # =====================================================

    c.setFont(
        "Helvetica",
        9
    )

    c.setFillColor(
        cfg["dark"]
    )

    c.drawCentredString(
        width / 2,
        height - 185,
        "This certificate is awarded to:"
    )

    # =====================================================
    # USER NAME
    # =====================================================

    c.setFont(
        "Times-Italic",
        25
    )

    c.drawCentredString(
        width / 2,
        height - 220,
        user_name
    )

    c.setStrokeColor(
        cfg["border"]
    )

    c.setLineWidth(1)

    c.line(
        width / 2 - 150,
        height - 232,
        width / 2 + 150,
        height - 232
    )

    # =====================================================
    # LEFT DESCRIPTION
    # =====================================================

    left_x = 105
    text_y = height - 300

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        left_x,
        text_y,
        "This certificate is awarded to:"
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawString(
        left_x,
        text_y - 25,
        "EcoCraft Sustainability Member"
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        left_x,
        text_y - 48,
        f"For achieving {cfg['range']}"
    )

    c.drawString(
        left_x,
        text_y - 68,
        "through sustainable actions,"
    )

    c.drawString(
        left_x,
        text_y - 88,
        "waste awareness and creativity."
    )

    # =====================================================
    # DIAMOND MEDALLION
    # =====================================================

    center_x = width / 2
    center_y = height / 2 - 38

    draw_diamond_medallion(
        c,
        center_x,
        center_y
    )

    # =====================================================
    # DIAMOND SHINE
    # =====================================================

    def sparkle(x, y, size=6):

        c.saveState()

        c.setStrokeColor(
            colors.white
        )

        c.setLineWidth(1.2)

        c.line(
            x - size,
            y,
            x + size,
            y
        )

        c.line(
            x,
            y - size,
            x,
            y + size
        )

        c.setStrokeColor(
            cfg["accent"]
        )

        c.setLineWidth(0.8)

        c.line(
            x - size * 0.6,
            y - size * 0.6,
            x + size * 0.6,
            y + size * 0.6
        )

        c.line(
            x - size * 0.6,
            y + size * 0.6,
            x + size * 0.6,
            y - size * 0.6
        )

        c.restoreState()

    sparkle(
        center_x - 68,
        center_y + 40,
        5
    )

    sparkle(
        center_x + 68,
        center_y + 40,
        5
    )

    sparkle(
        center_x - 65,
        center_y - 42,
        4
    )

    sparkle(
        center_x + 65,
        center_y - 42,
        4
    )

    # =====================================================
    # RIGHT INFORMATION
    # =====================================================

    right_x = width - 265

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawString(
        right_x,
        text_y,
        "ACHIEVEMENT LEVEL"
    )

    c.setFont(
        "Times-Bold",
        19
    )

    c.drawString(
        right_x,
        text_y - 30,
        "DIAMOND"
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        right_x,
        text_y - 54,
        f"EcoPoints Earned: {xp}"
    )

    c.drawString(
        right_x,
        text_y - 75,
        f"XP Range: {cfg['range']}"
    )

    c.drawString(
        right_x,
        text_y - 96,
        "Sustainability Achievement"
    )

    # =====================================================
    # SIGNATURE SECTION
    # =====================================================

    signature_y = 95

    c.setStrokeColor(
        cfg["border"]
    )

    c.setLineWidth(1)

    c.line(
        100,
        signature_y,
        245,
        signature_y
    )

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica",
        8
    )

    c.drawCentredString(
        172,
        signature_y - 15,
        "ECOCRAFT TEAM"
    )

    c.setFont(
        "Helvetica-Bold",
        9
    )

    c.drawCentredString(
        172,
        signature_y + 7,
        "Authorized Signature"
    )

    c.line(
        width - 245,
        signature_y,
        width - 100,
        signature_y
    )

    c.setFont(
        "Helvetica",
        8
    )

    c.drawCentredString(
        width - 172,
        signature_y - 15,
        "ECOCRAFT"
    )

    c.setFont(
        "Helvetica-Bold",
        9
    )

    c.drawCentredString(
        width - 172,
        signature_y + 7,
        "Program Director"
    )

    # =====================================================
    # DATE
    # =====================================================

    c.setFont(
        "Helvetica-Bold",
        8
    )

    c.drawString(
        70,
        60,
        "ISSUE DATE"
    )

    c.setFont(
        "Helvetica",
        8
    )

    date_text = issue_date.strftime(
        "%d %B %Y"
    )

    c.drawString(
        70,
        47,
        date_text
    )

    # =====================================================
    # CERTIFICATE NUMBER
    # =====================================================

    c.setFont(
        "Helvetica-Bold",
        8
    )

    c.drawCentredString(
        width / 2,
        52,
        certificate_number
    )

    c.setFont(
        "Helvetica",
        6.5
    )

    c.drawCentredString(
        width / 2,
        42,
        "Official EcoCraft Certificate"
    )

    # =====================================================
    # QR
    # =====================================================

    draw_top_left_qr(
        c,
        certificate_number,
        cfg,
        width,
        height
    )

    # =====================================================
    # DECORATIVE PENS
    # =====================================================

    draw_pen(
        c,
        72,
        120,
        cfg,
        reverse=False
    )

    draw_pen(
        c,
        width - 72,
        120,
        cfg,
        reverse=True
    )


# =========================================================
# BRONZE / GOLD - EXISTING DESIGN
# =========================================================

def draw_bronze_gold_certificate(
    c,
    certificate_number,
    user_name,
    tier,
    xp,
    issue_date,
    cfg,
    width,
    height
):

    # =====================================================
    # BACKGROUND
    # =====================================================

    c.setFillColor(
        cfg["bg"]
    )

    c.rect(
        0,
        0,
        width,
        height,
        fill=1,
        stroke=0
    )

    # subtle center panel
    c.setFillColor(
        colors.Color(
            cfg["bg"].red,
            cfg["bg"].green,
            cfg["bg"].blue,
            alpha=0.35
        )
    )

    c.roundRect(
        48,
        48,
        width - 96,
        height - 96,
        8,
        fill=1,
        stroke=0
    )

    # =====================================================
    # BORDERS
    # =====================================================

    draw_double_border(
        c,
        width,
        height,
        cfg
    )

    # =====================================================
    # TOP DECORATION
    # =====================================================

    draw_hanging_rope(
        c,
        85,
        height - 30,
        cfg
    )

    draw_hanging_rope(
        c,
        width - 85,
        height - 30,
        cfg
    )

    # =====================================================
    # ECOCRAFT
    # =====================================================

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawCentredString(
        width / 2,
        height - 67,
        "ECOCRAFT"
    )

    c.setFont(
        "Helvetica",
        6.5
    )

    c.drawCentredString(
        width / 2,
        height - 78,
        "TURNING WASTE INTO VALUE"
    )

    # =====================================================
    # TITLE
    # =====================================================

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Times-Bold",
        25
    )

    c.drawCentredString(
        width / 2,
        height - 115,
        cfg["title"]
    )

    c.setStrokeColor(
        cfg["accent"]
    )

    c.setLineWidth(1.5)

    c.line(
        width / 2 - 155,
        height - 128,
        width / 2 + 155,
        height - 128
    )

    c.setFont(
        "Times-Roman",
        12
    )

    c.drawCentredString(
        width / 2,
        height - 148,
        cfg["subtitle"]
    )

    # =====================================================
    # PRESENTED TO
    # =====================================================

    c.setFont(
        "Helvetica",
        9
    )

    c.setFillColor(
        cfg["dark"]
    )

    c.drawCentredString(
        width / 2,
        height - 185,
        "This certificate is awarded to:"
    )

    # =====================================================
    # USER NAME
    # =====================================================

    c.setFont(
        "Times-Italic",
        25
    )

    c.drawCentredString(
        width / 2,
        height - 220,
        user_name
    )

    c.setStrokeColor(
        cfg["border"]
    )

    c.setLineWidth(1)

    c.line(
        width / 2 - 150,
        height - 232,
        width / 2 + 150,
        height - 232
    )

    # =====================================================
    # LEFT DESCRIPTION
    # =====================================================

    left_x = 105
    text_y = height - 300

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        left_x,
        text_y,
        "This certificate is awarded to:"
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawString(
        left_x,
        text_y - 25,
        "EcoCraft Sustainability Member"
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        left_x,
        text_y - 48,
        f"For achieving {cfg['range']}"
    )

    c.drawString(
        left_x,
        text_y - 68,
        "through sustainable actions,"
    )

    c.drawString(
        left_x,
        text_y - 88,
        "waste awareness and creativity."
    )

    # =====================================================
    # MEDAL
    # =====================================================

    center_x = width / 2
    center_y = height / 2 - 38

    draw_medal(
        c,
        center_x,
        center_y,
        tier,
        cfg
    )

    # =====================================================
    # RIGHT INFORMATION
    # =====================================================

    right_x = width - 265

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawString(
        right_x,
        text_y,
        "ACHIEVEMENT LEVEL"
    )

    c.setFont(
        "Times-Bold",
        19
    )

    c.drawString(
        right_x,
        text_y - 30,
        tier.upper()
    )

    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        right_x,
        text_y - 54,
        f"EcoPoints Earned: {xp}"
    )

    c.drawString(
        right_x,
        text_y - 75,
        f"XP Range: {cfg['range']}"
    )

    c.drawString(
        right_x,
        text_y - 96,
        "Sustainability Achievement"
    )

    # =====================================================
    # SIGNATURE SECTION
    # =====================================================

    signature_y = 95

    c.setStrokeColor(
        cfg["border"]
    )

    c.setLineWidth(1)

    c.line(
        100,
        signature_y,
        245,
        signature_y
    )

    c.setFillColor(
        cfg["dark"]
    )

    c.setFont(
        "Helvetica",
        8
    )

    c.drawCentredString(
        172,
        signature_y - 15,
        "ECOCRAFT TEAM"
    )

    c.setFont(
        "Helvetica-Bold",
        9
    )

    c.drawCentredString(
        172,
        signature_y + 7,
        "Authorized Signature"
    )

    c.line(
        width - 245,
        signature_y,
        width - 100,
        signature_y
    )

    c.setFont(
        "Helvetica",
        8
    )

    c.drawCentredString(
        width - 172,
        signature_y - 15,
        "ECOCRAFT"
    )

    c.setFont(
        "Helvetica-Bold",
        9
    )

    c.drawCentredString(
        width - 172,
        signature_y + 7,
        "Program Director"
    )

    # =====================================================
    # DATE
    # =====================================================

    c.setFont(
        "Helvetica-Bold",
        8
    )

    c.drawString(
        70,
        60,
        "ISSUE DATE"
    )

    c.setFont(
        "Helvetica",
        8
    )

    date_text = issue_date.strftime(
        "%d %B %Y"
    )

    c.drawString(
        70,
        47,
        date_text
    )

    # =====================================================
    # CERTIFICATE NUMBER
    # =====================================================

    c.setFont(
        "Helvetica-Bold",
        8
    )

    c.drawCentredString(
        width / 2,
        52,
        certificate_number
    )

    c.setFont(
        "Helvetica",
        6.5
    )

    c.drawCentredString(
        width / 2,
        42,
        "Official EcoCraft Certificate"
    )

    # =====================================================
    # QR - TOP LEFT
    # =====================================================

    draw_top_left_qr(
        c,
        certificate_number,
        cfg,
        width,
        height
    )

    # =====================================================
    # DECORATIVE PENS
    # =====================================================

    draw_pen(
        c,
        72,
        120,
        cfg,
        reverse=False
    )

    draw_pen(
        c,
        width - 72,
        120,
        cfg,
        reverse=True
    )


# =========================================================
# MAIN PDF GENERATOR
# =========================================================

def generate_certificate_pdf(
    certificate_number: str,
    user_name: str,
    tier: str,
    xp: int,
    issue_date,
    verification_code: str
):

    # =====================================================
    # SAFETY CHECK
    # =====================================================

    calculated_tier = calculate_tier(xp)

    if calculated_tier != tier:

        raise ValueError(
            f"Tier mismatch. XP {xp} belongs to "
            f"{calculated_tier}, not {tier}."
        )

    if tier not in TIER_CONFIG:

        raise ValueError(
            f"Invalid certificate tier: {tier}"
        )

    cfg = TIER_CONFIG[tier]

    width, height = landscape(A4)

    pdf_path = os.path.join(
        GENERATED_DIR,
        f"{certificate_number}.pdf"
    )

    c = canvas.Canvas(
        pdf_path,
        pagesize=(width, height)
    )

    # =====================================================
    # SILVER
    # =====================================================

    if tier == "Silver":

        draw_silver_certificate(
            c=c,
            certificate_number=certificate_number,
            user_name=user_name,
            xp=xp,
            issue_date=issue_date,
            cfg=cfg,
            width=width,
            height=height
        )

    # =====================================================
    # DIAMOND
    # =====================================================

    elif tier == "Diamond":

        draw_diamond_certificate(
            c=c,
            certificate_number=certificate_number,
            user_name=user_name,
            xp=xp,
            issue_date=issue_date,
            cfg=cfg,
            width=width,
            height=height
        )

    # =====================================================
    # BRONZE + GOLD
    # =====================================================

    else:

        draw_bronze_gold_certificate(
            c=c,
            certificate_number=certificate_number,
            user_name=user_name,
            tier=tier,
            xp=xp,
            issue_date=issue_date,
            cfg=cfg,
            width=width,
            height=height
        )

    # =====================================================
    # SAVE
    # =====================================================

    c.showPage()
    c.save()

    return pdf_path


# =========================================================
# COMPLETE CERTIFICATE CREATION
# =========================================================

def create_certificate(user_id: int):

    user = get_user_details(user_id)

    xp = get_user_xp(user_id)

    tier = calculate_tier(xp)

    existing = get_certificate(user_id)

    if existing:

        return {
            "status": "already_exists",
            "message": "Certificate already generated.",
            "certificate": existing
        }

    certificate = save_certificate(
        user_id=user_id,
        user_name=user["name"],
        tier=tier,
        xp=xp
    )

    pdf_path = generate_certificate_pdf(
        certificate_number=certificate[
            "certificate_number"
        ],
        user_name=certificate[
            "user_name"
        ],
        tier=certificate[
            "tier"
        ],
        xp=certificate[
            "xp"
        ],
        issue_date=certificate[
            "issue_date"
        ],
        verification_code=certificate[
            "verification_code"
        ]
    )

    certificate["pdf_path"] = pdf_path

    return {
        "status": "success",
        "message": "Certificate generated successfully.",
        "certificate": certificate
    }