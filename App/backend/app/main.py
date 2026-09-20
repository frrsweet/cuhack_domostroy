from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import TaxiTariff, Order, RouteSearch
from app.routers import tariffs, orders, route_searches

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Taxi challenge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tariffs.router)
app.include_router(orders.router)
app.include_router(route_searches.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
