from fastapi import APIRouter, Depends
from app.api.dependencies import get_csv_service
from app.services.csv_service import CSVService

router = APIRouter()

@router.get("/phase2")
def get_phase2_data(mission_id: str = None, csv_service: CSVService = Depends(get_csv_service)):
    return csv_service.read_csv("gps_report.csv", mission_id)

