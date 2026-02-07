# HRMS Lite

A lightweight Human Resource Management System (HRMS) built with a modern full-stack approach.

## Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS
-   **Backend**: Python (FastAPI), SQLModel
-   **Database**: SQLite (Dev) / PostgreSQL (Prod)

## Features

-   **Employee Management**: Add, view, and delete employees.
-   **Attendance Management**: Mark and view daily attendance.

## Local Setup

### Backend

1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
