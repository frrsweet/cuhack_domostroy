from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from cuhack_domostroy.App.backend.app.database import get_db
from cuhack_domostroy.App.backend.app.models import Order, TaxiTariff
from cuhack_domostroy.App.backend.app.schemas import OrderCreate, OrderOut

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=list[OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.post("/", response_model=OrderOut)
def create_order(item: OrderCreate, db: Session = Depends(get_db)):
    tariff = db.query(TaxiTariff).filter(TaxiTariff.id == item.tariff_id).first()
    if not tariff:
        raise HTTPException(status_code=404, detail="Tariff not found")

    order = Order(
        from_address=item.from_address,
        to_address=item.to_address,
        route_points=item.route_points,
        tariff_id=item.tariff_id,
        total_price=float(tariff.price),
        status="created",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}", response_model=OrderOut)
def update_order(order_id: int, item: OrderCreate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    tariff = db.query(TaxiTariff).filter(TaxiTariff.id == item.tariff_id).first()
    if not tariff:
        raise HTTPException(status_code=404, detail="Tariff not found")

    order.from_address = item.from_address
    order.to_address = item.to_address
    order.route_points = item.route_points
    order.tariff_id = item.tariff_id
    order.total_price = float(tariff.price)
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"detail": "Order deleted"}
