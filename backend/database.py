from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os

# Use DATABASE_URL if set (Production), otherwise use local SQLite (Development)
database_url = os.environ.get("DATABASE_URL")

if database_url and database_url.startswith("postgres://"):
    # Fix for Render/Heroku using old postgres:// scheme
    database_url = database_url.replace("postgres://", "postgresql://", 1)

if database_url:
    # Production (PostgreSQL)
    engine = create_engine(database_url)
else:
    # Development (SQLite)
    sqlite_file_name = "database.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    connect_args = {"check_same_thread": False}
    engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
