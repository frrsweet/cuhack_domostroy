from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_ROOT = PROJECT_ROOT / "Frontend"

app = FastAPI(title="Horizon Drive API", version="1.0.0")
app.mount("/Frontend", StaticFiles(directory=FRONTEND_ROOT), name="frontend")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "horizon-drive"}


@app.get("/")
def home() -> FileResponse:
    return FileResponse(PROJECT_ROOT / "index.html")