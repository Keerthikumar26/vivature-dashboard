from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi import HTTPException
from pathlib import Path
from app.api.dependencies import get_csv_service
from app.services.csv_service import CSVService

router = APIRouter()

@router.get("/phase6")
def get_phase6_data(mission_id: str = None, csv_service: CSVService = Depends(get_csv_service)):
    import os
    if not mission_id:
        mission_folders = [f for f in os.listdir(csv_service.data_dir) if os.path.isdir(csv_service.data_dir / f)]
        mission_id = max(mission_folders) if mission_folders else ""

    mission_dir = csv_service.data_dir / mission_id if mission_id else csv_service.data_dir
    file_path = mission_dir / "mission.waypoints"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="mission.waypoints not found")
    with open(file_path, "r") as f:
        return PlainTextResponse(f.read())

