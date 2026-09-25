from fastapi import APIRouter, Depends
from app.api.dependencies import get_csv_service
from app.services.csv_service import CSVService

router = APIRouter()

@router.get("/phase4")
def get_phase4_data(mission_id: str = None, csv_service: CSVService = Depends(get_csv_service)):
    return csv_service.read_csv("coverage_path.csv", mission_id)

