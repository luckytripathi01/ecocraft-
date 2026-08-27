from transformers import pipeline
from PIL import Image

# Load RT-DETR model
detector = pipeline(
    "object-detection",
    model="PekingU/rtdetr_r50vd"
)

def detect_waste(image_path):

    image = Image.open(image_path).convert("RGB")

    results = detector(image)

    detected_items = []

    for obj in results:
        detected_items.append({
            "label": obj["label"],
            "score": round(float(obj["score"]), 2)
        })

    return detected_items