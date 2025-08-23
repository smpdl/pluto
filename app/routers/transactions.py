from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date
from app.deps import get_db, get_current_user
from app.schemas.transaction import TransactionCreate, TransactionRead
from app.models.transaction import Transaction
from app.models.account import Account
from app.models.user import User

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("", response_model=TransactionRead, status_code=201)
def create_txn(payload: TransactionCreate, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    acct = db.query(Account).filter(and_(Account.id == payload.account_id, Account.user_id == current.id)).first()
    if not acct:
        raise HTTPException(status_code=404, detail="Account not found")
    t = Transaction(
        user_id=current.id, account_id=payload.account_id, date=payload.date,
        amount=payload.amount, category=payload.category or "Other", description=payload.description
    )
    db.add(t); db.commit(); db.refresh(t)
    return TransactionRead(id=t.id, account_id=t.account_id, date=t.date, amount=t.amount, category=t.category, description=t.description)

@router.get("", response_model=list[TransactionRead])
def list_txns(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    account_id: int | None = None,
    category: str | None = None,
    from_date: date | None = Query(None, alias="from"),
    to_date: date | None = Query(None, alias="to"),
    limit: int = 50,
    offset: int = 0,
):
    q = db.query(Transaction).filter(Transaction.user_id == current.id)
    if account_id: q = q.filter(Transaction.account_id == account_id)
    if category: q = q.filter(Transaction.category == category)
    if from_date: q = q.filter(Transaction.date >= from_date)
    if to_date: q = q.filter(Transaction.date <= to_date)
    items = q.order_by(Transaction.date.desc()).offset(offset).limit(limit).all()
    return [
        TransactionRead(
            id=t.id, account_id=t.account_id, date=t.date,
            amount=t.amount, category=t.category, description=t.description
        ) for t in items
    ]
