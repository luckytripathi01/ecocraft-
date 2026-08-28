from fastapi import APIRouter

router = APIRouter(
    prefix="/ideas",
    tags=["AI Ideas"]
)

@router.get("/")
def ideas():
    return {
        "success": True,
        "ideas": [
            "Flower Pot",
            "Pen Stand",
            "Bird Feeder"
        ]
    }