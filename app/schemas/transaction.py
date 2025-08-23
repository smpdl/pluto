from pydantic import BaseModel
from datetime import date
from decimal import Decimal

class TransactionCreate(BaseModel):
    account_id: int
    date: date
    amount: Decimal
    category: str | None = None
    description: str | None = None

class TransactionRead(BaseModel):
    id: int
    account_id: int
    date: date
    amount: Decimal
    category: str | None = None
    description: str | None = None
