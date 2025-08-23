from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.schemas.account import AccountCreate, AccountRead
from app.models.account import Account
from app.models.user import User

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.post("", response_model=AccountRead, status_code=201)
def create_account(payload: AccountCreate, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    a = Account(user_id=current.id, name=payload.name, currency=payload.currency)
    db.add(a); db.commit(); db.refresh(a)
    return AccountRead(id=a.id, name=a.name, currency=a.currency)

@router.get("", response_model=list[AccountRead])
def list_accounts(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    rows = db.query(Account).filter(Account.user_id == current.id).all()
    return [AccountRead(id=r.id, name=r.name, currency=r.currency) for r in rows]
