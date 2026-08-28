import google.generativeai as genai
from config import Config

# Configure Gemini
genai.configure(api_key=Config.GEMINI_API_KEY)

# Load Model
model = genai.GenerativeModel("gemini-3.6-flash")


def generate_recycling_idea(waste_name, language="en"):

    if language == "hi":

        prompt = f"""
        {waste_name} se 5 creative recycling ideas batao.

        Hindi me answer do.

        Har idea bullet point me likho.

        Sirf useful ideas do.
        """

    else:

        prompt = f"""
        Suggest 5 creative recycling ideas using {waste_name}.

        Give the answer in English.

        Use bullet points.

        Give only practical ideas.
        """

    response = model.generate_content(prompt)

    return response.text