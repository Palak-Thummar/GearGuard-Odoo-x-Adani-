from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Equipment, Request
from ..schemas.schemas import EquipmentCreate, EquipmentOut

router = APIRouter()


@router.get("/", response_model=list[EquipmentOut])
def list_equipment(db: Session = Depends(get_db)):
    return db.query(Equipment).all()


@router.post("/", response_model=EquipmentOut)
def create_equipment(payload: EquipmentCreate, db: Session = Depends(get_db)):
    eq = Equipment(**payload.model_dump())
    db.add(eq)
    db.commit()
    db.refresh(eq)
    return eq


@router.get("/{equipment_id}", response_model=EquipmentOut)
def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    eq = db.query(Equipment).get(equipment_id)
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return eq


@router.get("/{equipment_id}/open_requests_count")
def open_requests_count(equipment_id: int, db: Session = Depends(get_db)):
    count = db.query(Request).filter(Request.equipment_id == equipment_id).join(Request.stage, isouter=True).filter((Request.stage == None) | (Request.stage.has(is_done=False))).count()  # noqa: E711
    return {"open": count}
