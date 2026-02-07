from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import date as DateType, datetime

class EmployeeBase(SQLModel):
    full_name: str
    email: str = Field(index=True, unique=True)
    department: str
    phone_number: Optional[str] = None
    designation: Optional[str] = None
    date_of_joining: Optional[DateType] = Field(default_factory=DateType.today)

class Employee(EmployeeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeRead(EmployeeBase):
    id: int
    created_at: datetime

class AttendanceBase(SQLModel):
    employee_id: int = Field(foreign_key="employee.id")
    date: DateType = Field(default_factory=DateType.today)
    status: str  # "Present", "Absent", "Leave"

class Attendance(AttendanceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceRead(AttendanceBase):
    id: int
    employee: Optional[Employee] = None

