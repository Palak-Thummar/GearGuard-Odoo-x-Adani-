from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base


class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    members = Column(String, nullable=True)  # comma-separated names/emails (simple)


class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    serial_no = Column(String, nullable=True)
    category = Column(String, nullable=True)
    location = Column(String, nullable=True)
    maintenance_team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    default_technician = Column(String, nullable=True)
    is_scrapped = Column(Boolean, default=False)

    team = relationship("Team")


class Stage(Base):
    __tablename__ = "stages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    sequence = Column(Integer, default=10)
    is_done = Column(Boolean, default=False)
    is_scrap = Column(Boolean, default=False)


class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # 'corrective' or 'preventive'
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    category = Column(String, nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    technician = Column(String, nullable=True)
    scheduled_date = Column(DateTime, nullable=True)
    duration = Column(Float, nullable=True)
    description = Column(String, nullable=True)
    stage_id = Column(Integer, ForeignKey("stages.id"), nullable=True)
    is_overdue = Column(Boolean, default=False)

    equipment = relationship("Equipment")
    team = relationship("Team")
    stage = relationship("Stage")
