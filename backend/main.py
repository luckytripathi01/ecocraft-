from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.guide import router as guide_router
from routes.auth import router as auth_router
from routes.waste import router as waste_router
from routes.ideas import router as ideas_router
from routes.youtube import router as youtube_router
from routes.marketplace import router as marketplace_router
from routes.iot import router as iot_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(waste_router)
app.include_router(ideas_router)
app.include_router(guide_router)
app.include_router(youtube_router)
app.include_router(marketplace_router)
app.include_router(iot_router)

@app.get("/")
def home():
    return {"message": "EcoCraft Backend Running"}
