from fastapi import APIRouter
from pydantic import BaseModel

from services.youtube_service import get_youtube_videos

router = APIRouter(
    prefix="/youtube",
    tags=["YouTube"]
)

class YoutubeRequest(BaseModel):
    waste_name: str

@router.post("/")
def youtube(data: YoutubeRequest):

    videos = get_youtube_videos(data.waste_name)

    return {
        "status": "success",
        "videos": videos
    }