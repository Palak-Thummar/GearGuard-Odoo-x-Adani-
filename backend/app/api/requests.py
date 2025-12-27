from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Request, Equipment, Stage
from ..schemas.schemas import RequestCreate, RequestUpdate, RequestOut

router = APIRouter()


@router.get("/", response_model=list[RequestOut])
def list_requests(db: Session = Depends(get_db)):
    return db.query(Request).all()


@router.post("/", response_model=RequestOut)
def create_request(payload: RequestCreate, db: Session = Depends(get_db)):
    equipment = db.query(Equipment).get(payload.equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    # Auto-fill category, team, technician from equipment if missing
    data = payload.model_dump()
    if not data.get("category"):
        data["category"] = equipment.category
    if not data.get("team_id"):
        data["team_id"] = equipment.maintenance_team_id
    if not data.get("technician"):
        data["technician"] = equipment.default_technician

    # Default stage: 'New'
    stage_new = db.query(Stage).filter(Stage.name == "New").first()
    data["stage_id"] = stage_new.id if stage_new else None

    # Name default
    if not data.get("name"):
        data["name"] = f"REQ-{int(datetime.utcnow().timestamp())}"

    req = Request(**data)
    # Overdue compute
    if req.scheduled_date:
        req.is_overdue = req.scheduled_date < datetime.utcnow()

    db.add(req)
    db.commit()
    db.refresh(req)
    return req


@router.put("/{request_id}", response_model=RequestOut)
def update_request(request_id: int, payload: RequestUpdate, db: Session = Depends(get_db)):
    req = db.query(Request).get(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(req, k, v)

    # Scrap logic: flag equipment when moved to scrap
    if "stage_id" in data and data["stage_id"] is not None:
        stage = db.query(Stage).get(data["stage_id"])
        if stage and stage.is_scrap and req.equipment_id:
            equipment = db.query(Equipment).get(req.equipment_id)
            if equipment and not equipment.is_scrapped:
                equipment.is_scrapped = True

    # Recompute overdue
    if req.scheduled_date:
        # Stage done negates overdue
        stage = db.query(Stage).get(req.stage_id) if req.stage_id else None
        req.is_overdue = (req.scheduled_date < datetime.utcnow()) and not (stage and stage.is_done)

    db.commit()
    db.refresh(req)
    return req
