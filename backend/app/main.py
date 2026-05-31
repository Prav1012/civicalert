from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import reports, emergency, auth
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CivicAlert API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(reports.router, prefix="/reports")
app.include_router(emergency.router, prefix="/emergency")