from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import dashboard, phase1, phase2, phase3, phase4, phase5, phase6, phase7, analytics, reports, settings, missions

app = FastAPI(title="Vivature Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, prefix="/api")
app.include_router(phase1.router, prefix="/api")
app.include_router(phase2.router, prefix="/api")
app.include_router(phase3.router, prefix="/api")
app.include_router(phase4.router, prefix="/api")
app.include_router(phase5.router, prefix="/api")
app.include_router(phase6.router, prefix="/api")
app.include_router(phase7.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(missions.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Vivature Dashboard API is running"}
