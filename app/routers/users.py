from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.schemas.user import UserRead
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserRead)
def me(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    return UserRead(id=current.id, email=current.email, full_name=current.full_name)
