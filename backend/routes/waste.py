from fastapi import APIRouter, UploadFile, File, Form
from services.detection_service import detect_waste
from services.gemini_service import generate_recycling_idea
from services.youtube_service import get_youtube_videos

import os
import shutil
import uuid

router = APIRouter(
    prefix="/waste",
    tags=["Waste"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

WASTE_MAPPING = {
    "bottle": "Plastic Bottle",
    "cup": "Plastic Cup",
    "wine glass": "Glass Bottle",
    "book": "Paper",
    "cell phone": "E-Waste",
    "laptop": "E-Waste",
    "keyboard": "E-Waste",
    "mouse": "E-Waste",
    "banana": "Organic Waste",
    "apple": "Organic Waste",
    "orange": "Organic Waste"
}


@router.post("/scan")
async def scan_waste(
    image: UploadFile = File(...),
    language: str = Form("en")
):

    file_extension = os.path.splitext(image.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_FOLDER, file_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        detections = detect_waste(file_path)

        if not detections:
            return {
                "status": "failed",
                "message": "No waste detected."
            }

        final_result = []

        for item in detections:

            label = item["label"]
            confidence = item["score"]

            waste_name = WASTE_MAPPING.get(
                label,
                label.title()
            )

            ideas = generate_recycling_idea(
                waste_name,
                language
            )

            videos = get_youtube_videos(
                waste_name
            )

            final_result.append({
                "item": waste_name,
                "confidence": confidence,
                "ideas": ideas,
                "videos": videos
            })

        return {
            "status": "success",
            "language": language,
            "total_items": len(final_result),
            "detections": final_result
        }

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)