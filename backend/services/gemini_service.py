from google import genai
from config import Config


client = genai.Client(
    api_key=Config.GEMINI_API_KEY
)


def generate_recycling_idea(waste_name, language="en"):

    if language == "hi":
        prompt = f"""
{waste_name} se 5 creative recycling ideas batao.

Hindi me answer do.

Har idea bullet point me likho.

Sirf useful aur practical ideas do.
"""
    else:
        prompt = f"""
Suggest 5 creative recycling ideas using {waste_name}.

Give the answer in English.

Use bullet points.

Give only useful and practical ideas.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text