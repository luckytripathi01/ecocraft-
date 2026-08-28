from fastapi import APIRouter, UploadFile, File, Form
from services.detection_service import detect_waste
from services.gemini_service import generate_recycling_idea
from services.guide_service import generate_project_guide
from services.youtube_service import get_youtube_videos

import os
import shutil

router = APIRouter(
    prefix="/waste",
    tags=["Waste"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# COCO Label Mapping
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

    file_path = os.path.join(UPLOAD_FOLDER, image.filename)

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

        waste_name = WASTE_MAPPING.get(label, label.title())

        # AI Ideas
        ideas = generate_recycling_idea(
            waste_name,
            language
        )
        print("Ideas type:", type(ideas))
        print("Ideas value:", ideas)
        # Step by Step Guide
        #guide = generate_project_guide(
         #   waste_name,
          #  language
       # )

        # YouTube Videos
        videos = get_youtube_videos(
            waste_name
        )

        final_result.append({
            "item": waste_name,
            "confidence": confidence,
            "ideas": ideas,
           # "guide": guide,
            "videos": videos
        })

    return {
        "status": "success",
        "language": language,
        "total_items": len(final_result),
        "detections": final_result
    }