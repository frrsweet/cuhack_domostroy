from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import RouteSearch
from app.schemas import RouteSearchCreate, RouteSearchOut

router = APIRouter(prefix="/route-searches", tags=["route-searches"])


@router.get("/", response_model=list[RouteSearchOut])
def list_searches(db: Session = Depends(get_db)):
    return db.query(RouteSearch).all()


@router.post("/", response_model=RouteSearchOut)
def create_search(item: RouteSearchCreate, db: Session = Depends(get_db)):
    search = RouteSearch(
        from_address=item.from_address,
        to_address=item.to_address,
        route_json=item.route_json,
    )
    db.add(search)
    db.commit()
    db.refresh(search)
    return search


@router.get("/{search_id}", response_model=RouteSearchOut)
def get_search(search_id: int, db: Session = Depends(get_db)):
    search = db.query(RouteSearch).filter(RouteSearch.id == search_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Search not found")
    return search


@router.put("/{search_id}", response_model=RouteSearchOut)
def update_search(search_id: int, item: RouteSearchCreate, db: Session = Depends(get_db)):
    search = db.query(RouteSearch).filter(RouteSearch.id == search_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Search not found")
    search.from_address = item.from_address
    search.to_address = item.to_address
    search.route_json = item.route_json
    db.commit()
    db.refresh(search)
    return search


@router.delete("/{search_id}")
def delete_search(search_id: int, db: Session = Depends(get_db)):
    search = db.query(RouteSearch).filter(RouteSearch.id == search_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Search not found")
    db.delete(search)
    db.commit()
    return {"detail": "Search deleted"}
