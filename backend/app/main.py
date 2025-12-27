from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import init_db
from .api import equipment, teams, requests

app = FastAPI(title="GearGuard Maintenance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

app.include_router(equipment.router, prefix="/api/equipment", tags=["equipment"])
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(requests.router, prefix="/api/requests", tags=["requests"])
