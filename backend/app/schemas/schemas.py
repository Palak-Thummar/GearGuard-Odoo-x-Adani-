from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TeamCreate(BaseModel):
    name: str
    members: Optional[str] = None


class TeamOut(TeamCreate):
    id: int
    class Config:
        from_attributes = True


class EquipmentCreate(BaseModel):
    name: str
    serial_no: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    maintenance_team_id: Optional[int] = None
    default_technician: Optional[str] = None


class EquipmentOut(EquipmentCreate):
    id: int
    is_scrapped: bool = False
    class Config:
        from_attributes = True


class StageCreate(BaseModel):
    name: str
    sequence: int = 10
    is_done: bool = False
    is_scrap: bool = False


class StageOut(StageCreate):
    id: int
    class Config:
        from_attributes = True


class RequestCreate(BaseModel):
    name: str
    type: str
    equipment_id: int
    category: Optional[str] = None
    team_id: Optional[int] = None
    technician: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    duration: Optional[float] = None
    description: Optional[str] = None


class RequestUpdate(BaseModel):
    stage_id: Optional[int] = None
    duration: Optional[float] = None


class RequestOut(BaseModel):
    id: int
    name: str
    type: str
    equipment_id: int
    category: Optional[str]
    team_id: Optional[int]
    technician: Optional[str]
    scheduled_date: Optional[datetime]
    duration: Optional[float]
    description: Optional[str]
    stage_id: Optional[int]
    is_overdue: bool
    class Config:
        from_attributes = True
