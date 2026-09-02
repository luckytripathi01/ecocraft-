from transformers import pipeline
from PIL import Image

detector = None


def get_detector():
    global detector

    if detector is None:
        detector = pipeline(
            "object-detection",
            model="PekingU/rtdetr_r18vd",
            device=-1
        )

    return detector


def detect_waste(image_path):
    image = Image.open(image_path).convert("RGB")

    detector_model = get_detector()
    results = detector_model(image)

    detected_items = []

    for obj in results:
        detected_items.append({
            "label": obj["label"],
            "score": round(float(obj["score"]), 2)
        })

    return detected_items