from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class TaxiTariff(Base):
    __tablename__ = "taxi_tariffs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    is_autopilot = Column(Boolean, default=False)
    image_name = Column(String, nullable=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    from_address = Column(String, nullable=False)
    to_address = Column(String, nullable=False)
    route_points = Column(String, nullable=True)
    tariff_id = Column(Integer, ForeignKey("taxi_tariffs.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="created")

    tariff = relationship("TaxiTariff")


class RouteSearch(Base):
    __tablename__ = "route_searches"

    id = Column(Integer, primary_key=True, index=True)
    from_address = Column(String, nullable=False)
    to_address = Column(String, nullable=False)
    route_json = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
