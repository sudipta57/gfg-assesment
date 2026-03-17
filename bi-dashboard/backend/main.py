from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
import pandas as pd
import sqlite3
import os
import shutil

from database import init_db, get_schema, read_csv_with_fallback
from query_engine import process_query


def _backend_path(path: str) -> str:
    """Resolve a backend-relative path to an absolute path."""
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    normalized_path = path[len("backend/") :] if path.startswith("backend/") else path
    return os.path.join(backend_dir, normalized_path)


class QueryRequest(BaseModel):
    """Request model for natural-language dashboard queries."""

    prompt: str
    session_id: str = "default"


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Initialize application resources on startup."""
    init_db()
    print("Server started. Database ready.")
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    """Return API entrypoint metadata."""
    return {
        "message": "Welcome to BI Dashboard API",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    """Return health information for service monitoring."""
    return {"status": "ok", "message": "BI Dashboard API is running"}


@app.get("/schema")
def schema() -> dict[str, str]:
    """Return the current database schema for the sales table."""
    try:
        schema_string = get_schema()
        return {"schema": schema_string}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/query")
def query(request: QueryRequest) -> dict:
    """Process a natural-language query and return dashboard configuration with data."""
    try:
        if not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        result = process_query(request.prompt)
        if result.get("success") is False:
            raise HTTPException(status_code=422, detail=result.get("error", "Unknown error"))

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/upload-csv")
def upload_csv(file: UploadFile = File(...)) -> dict:
    """Upload a CSV file and replace the sales table with its contents."""
    temp_path = _backend_path("backend/data/uploaded.csv")
    db_path = _backend_path("backend/sales.db")

    try:
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")

        os.makedirs(os.path.dirname(temp_path), exist_ok=True)

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        df = read_csv_with_fallback(temp_path)
        df.columns = [column.strip().lower().replace(" ", "_") for column in df.columns]

        connection = sqlite3.connect(db_path)
        try:
            df.to_sql("sales", connection, if_exists="replace", index=False)
        finally:
            connection.close()

        if os.path.exists(temp_path):
            os.remove(temp_path)

        return {
            "success": True,
            "message": f"CSV loaded successfully. {len(df)} rows imported.",
            "columns": list(df.columns),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
