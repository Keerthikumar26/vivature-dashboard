from fastapi import APIRouter, Depends
from app.api.dependencies import get_csv_service
from app.services.csv_service import CSVService

router = APIRouter()

@router.get("/phase1")
def get_phase1_data(mission_id: str = None, csv_service: CSVService = Depends(get_csv_service)):
    return csv_service.read_csv("field_report.csv", mission_id)

