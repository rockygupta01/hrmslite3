from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import Employee, EmployeeCreate, EmployeeRead
from typing import List

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, session: Session = Depends(get_session)):
    db_employee = Employee.from_orm(employee)
    try:
        session.add(db_employee)
        session.commit()
        session.refresh(db_employee)
    except Exception as e:
        session.rollback()
        # Clean robust error handling for duplicate email
        if "UNIQUE constraint failed: employee.email" in str(e):
             raise HTTPException(status_code=400, detail="Email already exists")
        raise HTTPException(status_code=500, detail=str(e))
    return db_employee

@router.get("/", response_model=List[EmployeeRead])
def read_employees(offset: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    employees = session.exec(select(Employee).offset(offset).limit(limit)).all()
    return employees

@router.get("/{employee_id}", response_model=EmployeeRead)
def read_employee(employee_id: int, session: Session = Depends(get_session)):
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, session: Session = Depends(get_session)):
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    session.delete(employee)
    session.commit()
    return {"ok": True}
