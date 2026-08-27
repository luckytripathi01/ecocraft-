from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.get("/login")
def login():
    return {
        "success": True,
        "message": "Login API Working"
    }

@router.get("/signup")
def signup():
    return {
        "success": True,
        "message": "Signup API Working"
    }