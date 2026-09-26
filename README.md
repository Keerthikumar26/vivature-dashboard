# Vivature Dashboard

UAV-assisted Precision Agriculture Dashboard for visualizing outputs from six completed image-processing phases.

This application is a **visualization platform only**. It does not execute image processing — it reads outputs produced by the existing Python pipeline.

## Project Structure

```
vivature-dashboard/
├── frontend/          # React 19 + TypeScript + Vite
├── backend/           # FastAPI + Python 3.11
└── README.md
```

## Tech Stack

### Frontend
- React 19, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- React Router, Axios
- Plotly, React Leaflet, React Hook Form, Lucide Icons

### Backend
- FastAPI, Python 3.11, Uvicorn
- Pandas, Pydantic

## Getting Started

### Backend

```bash
cd "C:\II YEAR_MECHANICAL ACADEMICS\EXTRA CURRICULAR\PROJECTS\LIL- SPCETRAL ANALYSIS\CODE\PHASE2-7\vivature-dashboard\backend"
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate # macOS/Linux
pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd "C:\II YEAR_MECHANICAL ACADEMICS\EXTRA CURRICULAR\PROJECTS\LIL- SPCETRAL ANALYSIS\CODE\PHASE2-7\vivature-dashboard\frontend"
npm install
npm run dev
#(or)
npm.cmd run dev
```

Dashboard: 

### Environment

Copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | /api/dashboard     | Dashboard overview       |
| GET    | /api/phase1        | Crop Health (Phase 1)    |
| GET    | /api/phase2        | GPS Mapping (Phase 2)    |
| GET    | /api/phase3        | Stress Zones (Phase 3)   |
| GET    | /api/phase4        | Coverage Path (Phase 4)  |
| GET    | /api/phase5        | Spray Mission (Phase 5)  |
| GET    | /api/phase6        | Mission Planner (Phase 6) |
| GET    | /api/analytics     | Analytics                |
| GET    | /api/reports       | Reports                  |
| GET    | /api/settings      | Settings                 |

## Pipeline Outputs

| Phase | Input              | Output              |
|-------|--------------------|---------------------|
| 1     | Multispectral Image| field_report.csv    |
| 2     | field_report.csv   | gps_report.csv      |
| 3     | gps_report.csv     | spray_zones.csv     |
| 4     | spray_zones.csv    | coverage_path.csv   |
| 5     | coverage_path.csv  | spray_mission.csv   |
| 6     | spray_mission.csv  | mission.waypoints   |
