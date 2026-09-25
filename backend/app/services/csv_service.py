import pandas as pd
from pathlib import Path
from fastapi import HTTPException
import os

class CSVService:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        
    def read_csv(self, filename: str, mission_id: str = None) -> list[dict]:
        if not mission_id:
            # Find the most recent mission folder if none provided
            mission_folders = [f for f in os.listdir(self.data_dir) if os.path.isdir(self.data_dir / f)]
            if mission_folders:
                mission_id = max(mission_folders)
            else:
                mission_id = ""

        mission_dir = self.data_dir / mission_id if mission_id else self.data_dir
        file_path = mission_dir / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail=f"File not found: {filename} in mission {mission_id}")
            
        if file_path.stat().st_size == 0:
            raise HTTPException(status_code=400, detail=f"File is empty: {filename}")
            
        try:
            df = pd.read_csv(file_path)
            if df.empty:
                raise HTTPException(status_code=400, detail=f"File contains no data: {filename}")
            
            # Replace NaNs with None to ensure JSON compliance
            df = df.where(pd.notnull(df), None)
            return df.to_dict(orient="records")
            
        except pd.errors.EmptyDataError:
            raise HTTPException(status_code=400, detail=f"File is empty or invalid: {filename}")
        except pd.errors.ParserError:
            raise HTTPException(status_code=400, detail=f"Invalid CSV format: {filename}")
        except Exception as e:
            if isinstance(e, HTTPException):
                raise
            raise HTTPException(status_code=500, detail=f"An error occurred while reading the file: {str(e)}")
