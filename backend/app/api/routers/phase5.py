from fastapi import APIRouter, Depends
from app.api.dependencies import get_csv_service
from app.services.csv_service import CSVService

router = APIRouter()

@router.get("/phase5")
def get_phase5_data(mission_id: str = None, csv_service: CSVService = Depends(get_csv_service)):
    return csv_service.read_csv("spray_mission.csv", mission_id)

