from app.services.csv_service import CSVService
from app.config import settings

csv_service = CSVService(data_dir=settings.DATA_DIR)

def get_csv_service() -> CSVService:
    return csv_service
