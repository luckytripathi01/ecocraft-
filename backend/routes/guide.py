from fastapi import APIRouter
from pydantic import BaseModel

from services.guide_service import generate_project_guide

router = APIRouter(
    prefix="/guide",
    tags=["Guide"]
)

class GuideRequest(BaseModel):
    waste_name: str
    language: str = "en"


@router.post("/")
def get_guide(data: GuideRequest):

    guide = generate_project_guide(
        data.waste_name,
        data.language
    )

    return {
        "status": "success",
        "guide": guide
    }