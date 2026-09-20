from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_ROOT = PROJECT_ROOT / "Frontend"

app = FastAPI(title="Horizon Drive API", version="1.0.0")
app.mount("/Frontend", StaticFiles(directory=FRONTEND_ROOT), name="frontend")

clients: set[WebSocket] = set()
state_store: dict[str, object] = {}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "horizon-drive"}


@app.get("/")
def home() -> FileResponse:
    return FileResponse(PROJECT_ROOT / "index.html")


@app.websocket("/horizon")
async def horizon_bridge(websocket: WebSocket) -> None:
    await websocket.accept()
    clients.add(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            payload = json.loads(message)
            key = payload.get("key") if isinstance(payload, dict) else None
            value = payload.get("value") if isinstance(payload, dict) else None
            if payload.get("type") == "state" and key is not None:
                state_store[key] = value
                for client in list(clients):
                    if client is websocket:
                        continue
                    try:
                        await client.send_text(json.dumps({"type": "state", "key": key, "value": value}))
                    except RuntimeError:
                        pass
            elif payload.get("type") == "hello":
                for item_key, item_value in state_store.items():
                    await websocket.send_text(json.dumps({"type": "state", "key": item_key, "value": item_value}))
    except WebSocketDisconnect:
        pass
    finally:
        clients.discard(websocket)