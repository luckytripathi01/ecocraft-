import google.generativeai as genai
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-flash-latest")


def generate_project_guide(waste_name, language="en"):

    if language == "hi":

        prompt = f"""
        {waste_name} का उपयोग करके एक DIY Recycling Project बनाना है।

        उत्तर पूरी तरह हिन्दी में दो।

        निम्नलिखित Format में उत्तर दो:

        ♻ परियोजना का नाम

        🧰 आवश्यक सामग्री

        📝 बनाने की प्रक्रिया (Step by Step)

        💡 उपयोगी सुझाव

        ⚠ सुरक्षा सुझाव

        उत्तर आसान भाषा में लिखो।
        """

    else:

        prompt = f"""
        Explain how to make a DIY recycling project using {waste_name}.

        Give the answer in this format:

        Project Name

        Materials Required

        Step-by-Step Guide

        Useful Tips

        Safety Tips

        Use simple English.
        """

    response = model.generate_content(prompt)

    return response.text