from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Team
from ..schemas.schemas import TeamCreate, TeamOut

router = APIRouter()


@router.get("/", response_model=list[TeamOut])
def list_teams(db: Session = Depends(get_db)):
    return db.query(Team).all()


@router.post("/", response_model=TeamOut)
def create_team(payload: TeamCreate, db: Session = Depends(get_db)):
    team = Team(**payload.model_dump())
    db.add(team)
    db.commit()
    db.refresh(team)
    return team
