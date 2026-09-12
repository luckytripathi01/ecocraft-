from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection


router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


class CreateListingRequest(BaseModel):
    seller_id: int
    title: str
    description: str | None = None
    price: float
    quantity: int = 1
    condition_text: str | None = None
    material_id: int | None = None


@router.get("/listings")
def get_listings():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                listing_id,
                seller_id,
                title,
                description,
                price,
                quantity,
                condition_text,
                status,
                created_at
            FROM listings
            WHERE status = 'active'
            ORDER BY created_at DESC
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


@router.post("/listings")
def create_listing(data: CreateListingRequest):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT user_id FROM users WHERE user_id = %s",
            (data.seller_id,)
        )

        user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="Seller user not found"
            )

        cursor.execute("""
            INSERT INTO listings
            (
                seller_id,
                material_id,
                title,
                description,
                price,
                quantity,
                condition_text,
                status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'active')
        """, (
            data.seller_id,
            data.material_id,
            data.title,
            data.description,
            data.price,
            data.quantity,
            data.condition_text
        ))

        listing_id = cursor.lastrowid

        cursor.execute(
            "UPDATE users SET role = 'seller' WHERE user_id = %s AND role = 'buyer'",
            (data.seller_id,)
        )

        connection.commit()

        return {
            "success": True,
            "message": "Product listed successfully",
            "listing": {
                "listing_id": listing_id,
                "seller_id": data.seller_id,
                "title": data.title,
                "description": data.description,
                "price": data.price,
                "quantity": data.quantity,
                "condition_text": data.condition_text,
                "status": "active"
            }
        }

    finally:
        cursor.close()
        connection.close()
