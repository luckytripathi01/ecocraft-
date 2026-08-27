from googleapiclient.discovery import build
from config import Config

YOUTUBE_API_KEY = Config.YOUTUBE_API_KEY


def get_youtube_videos(waste_name):
    youtube = build(
        "youtube",
        "v3",
        developerKey=YOUTUBE_API_KEY
    )

    query = f"{waste_name} recycling DIY craft"

    request = youtube.search().list(
        part="snippet",
        q=query,
        type="video",
        maxResults=3
    )

    response = request.execute()

    videos = []

    for item in response["items"]:
        videos.append({
            "title": item["snippet"]["title"],
            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
        })

    return videos