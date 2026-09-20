from pydantic import BaseModel, Field
from typing import Optional, List


class TaxiTariffCreate(BaseModel):
    name: str
    description: str
    price: int
    is_autopilot: bool = False
    image_name: Optional[str] = None


class TaxiTariffOut(TaxiTariffCreate):
    id: int


class OrderCreate(BaseModel):
    from_address: str = Field(..., min_length=1)
    to_address: str = Field(..., min_length=1)
    tariff_id: int
    route_points: Optional[str] = None


class OrderOut(BaseModel):
    id: int
    from_address: str
    to_address: str
    tariff_id: int
    total_price: float
    status: str


class RouteSearchCreate(BaseModel):
    from_address: str
    to_address: str
    route_json: Optional[str] = None


class RouteSearchOut(RouteSearchCreate):
    id: int
