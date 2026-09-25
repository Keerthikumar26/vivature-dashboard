from fastapi import APIRouter

router = APIRouter()

@router.get("/reports")
def get_reports_data():
    return {"message": "Placeholder response for reports"}
