from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import Attendance, AttendanceCreate, AttendanceRead, Employee
from typing import List
from datetime import date

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/", response_model=AttendanceRead, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate, session: Session = Depends(get_session)):
    # Check if employee exists
    employee = session.get(Employee, attendance.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check for duplicate attendance for the same day
    statement = select(Attendance).where(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    )
    existing_attendance = session.exec(statement).first()
    
    if existing_attendance:
        # Update existing record instead of failing? Or fail? Requirement says "Mark attendance", usually implies create.
        # Let's update if it exists to be more user friendly, or just return it.
        # Actually, let's returning 400 for now as per "Duplicate handling" requirement, though that was for employees.
        # Let's update it to allow correcting mistakes.
        existing_attendance.status = attendance.status
        session.add(existing_attendance)
        session.commit()
        session.refresh(existing_attendance)
        return existing_attendance

    db_attendance = Attendance.from_orm(attendance)
    session.add(db_attendance)
    session.commit()
    session.refresh(db_attendance)
    return db_attendance

@router.get("/{employee_id}", response_model=List[AttendanceRead])
def read_attendance(employee_id: int, session: Session = Depends(get_session)):
    statement = select(Attendance).where(Attendance.employee_id == employee_id).order_by(Attendance.date.desc())
    attendance_records = session.exec(statement).all()
    return attendance_records

@router.get("/", response_model=List[AttendanceRead])
def read_all_attendance(offset: int = 0, limit: int = 100, session: Session = Depends(get_session)):
     # Allow filtering by date if needed later
    attendance_records = session.exec(select(Attendance).offset(offset).limit(limit)).all()
    return attendance_records
