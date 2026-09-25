from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies import get_csv_service
from app.services.csv_service import CSVService
import os
import json

router = APIRouter()

@router.get("/phase7")
def get_phase7_data(mission_id: str = None, csv_service: CSVService = Depends(get_csv_service)):
    if not mission_id:
        mission_folders = [f for f in os.listdir(csv_service.data_dir) if os.path.isdir(csv_service.data_dir / f)]
        mission_id = max(mission_folders) if mission_folders else ""

    mission_dir = csv_service.data_dir / mission_id if mission_id else csv_service.data_dir
    file_path = mission_dir / "agronomist_report.json"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="agronomist_report.json not found. Have you run PHASE7.py for this mission?")
        
    with open(file_path, "r") as f:
        return json.load(f)
