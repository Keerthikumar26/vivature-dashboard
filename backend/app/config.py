import os
from pathlib import Path

class Settings:
    PROJECT_NAME: str = "Vivature Dashboard"
    API_V1_STR: str = "/api"
    # Default to the output directory in the project root if not provided
    DATA_DIR: str = os.getenv("DATA_DIR", str(Path(__file__).resolve().parent.parent.parent.parent / "output"))

settings = Settings()
