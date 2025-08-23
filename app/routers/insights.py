from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.deps import get_db, get_current_user
from app.models.transaction import Transaction
from app.models.user import User

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/pluto-score")
def pluto_score(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    since = date.today() - timedelta(days=30)
    income = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current.id, Transaction.date >= since, Transaction.amount > 0
    ).scalar() or 0
    spend = abs(float(db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current.id, Transaction.date >= since, Transaction.amount < 0
    ).scalar() or 0))
    income = float(income)
    savings_rate = (income - spend) / income if income > 0 else 0.0
    distinct_cats = db.query(Transaction.category).filter(
        Transaction.user_id == current.id, Transaction.date >= since, Transaction.category.isnot(None)
    ).distinct().count()
    diversity = min(distinct_cats, 6) / 6.0
    score = max(0, min(100, round((0.7 * savings_rate + 0.3 * diversity) * 100, 2)))
    return {
        "score": score,
        "window_days": 30,
        "income_30d": round(income, 2),
        "spend_30d": round(spend, 2),
        "savings_rate": round(savings_rate, 3),
        "category_diversity": distinct_cats,
    }
