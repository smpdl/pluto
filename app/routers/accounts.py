
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.schemas.account import AccountCreate, AccountRead, AccountLinkRequest
from app.models.account import Account
from app.models.user import User
from app.services.fake_plaid import link_fake_account
from app.schemas.plaid_fake import PlaidTransactionsGetResponse

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.post("/link", response_model=AccountRead)
def link_account(
    payload: AccountLinkRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Fake Plaid: Link a new account for the user with username/password and seed with fake transactions.
    """
    try:
        account = link_fake_account(
            db=db,
            user_id=user.id,
            username=payload.username,
            account_type=payload.account_type,
            nickname=payload.nickname
        )
        
        return AccountRead(
            id=account.id,
            name=account.name,
            nickname=account.nickname,
            currency=account.currency,
            type=account.type,
            mask=account.mask,
            balance=account.balance
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to link account: {str(e)}")

@router.post("/plaid/transactions/get", response_model=PlaidTransactionsGetResponse)
def plaid_transactions_get(
    account_id: str,
    start_date: str = None,
    end_date: str = None,
    count: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    from app.services.fake_plaid import plaidish_transactions_get
    return plaidish_transactions_get(db, user.id, account_id_label=account_id, start_date=start_date, end_date=end_date, limit=count, offset=offset)

@router.post("", response_model=AccountRead, status_code=201)
def create_account(payload: AccountCreate, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    a = Account(
        user_id=current.id, 
        name=payload.name, 
        nickname=payload.nickname,
        currency=payload.currency, 
        type=payload.type, 
        mask=payload.mask
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    return AccountRead(
        id=a.id, 
        name=a.name, 
        nickname=a.nickname,
        currency=a.currency, 
        type=a.type, 
        mask=a.mask,
        balance=a.balance
    )

@router.get("", response_model=list[AccountRead])
def list_accounts(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    rows = db.query(Account).filter(Account.user_id == current.id).all()
    return [
        AccountRead(
            id=r.id, 
            name=r.name, 
            nickname=r.nickname,
            currency=r.currency, 
            type=r.type, 
            mask=r.mask,
            balance=r.balance
        ) for r in rows
    ]
