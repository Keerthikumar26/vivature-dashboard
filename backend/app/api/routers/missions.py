from fastapi import APIRouter, Depends
from typing import List
import os
from app.api.dependencies import get_csv_service
from app.services.csv_service import CSVService

router = APIRouter()

@router.get("/missions", response_model=List[str])
def get_missions(csv_service: CSVService = Depends(get_csv_service)):
    if not csv_service.data_dir.exists():
        return []
    mission_folders = [f for f in os.listdir(csv_service.data_dir) if os.path.isdir(csv_service.data_dir / f)]
    return sorted(mission_folders, reverse=True)
