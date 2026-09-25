from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_data():
    return {"message": "Placeholder response for dashboard"}
