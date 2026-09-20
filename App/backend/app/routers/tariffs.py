from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import TaxiTariff
from app.schemas import TaxiTariffCreate, TaxiTariffOut

router = APIRouter(prefix="/tariffs", tags=["tariffs"])


@router.get("/", response_model=list[TaxiTariffOut])
def get_tariffs(db: Session = Depends(get_db)):
    return db.query(TaxiTariff).all()


@router.post("/", response_model=TaxiTariffOut)
def create_tariff(item: TaxiTariffCreate, db: Session = Depends(get_db)):
    new_item = TaxiTariff(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get("/{tariff_id}", response_model=TaxiTariffOut)
def get_tariff(tariff_id: int, db: Session = Depends(get_db)):
    item = db.query(TaxiTariff).filter(TaxiTariff.id == tariff_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Tariff not found")
    return item
