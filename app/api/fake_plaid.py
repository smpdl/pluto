from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.deps import get_db, get_current_user
from app.schemas.plaid_fake import PlaidTransactionsGetResponse
from app.services.fake_plaid import plaidish_transactions_get

router = APIRouter(prefix="/fake/plaid", tags=["fake-plaid"])

@router.get("/transactions", response_model=PlaidTransactionsGetResponse)
def transactions_get(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    account_id: str = Query("12345"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    return plaidish_transactions_get(
        db=db,
        user_id=user.id,
        account_id_label=account_id,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        offset=offset,
    )
