from pydantic import BaseModel
from decimal import Decimal

class AccountCreate(BaseModel):
    name: str
    nickname: str | None = None
    currency: str = "USD"
    type: str = "checking"
    mask: str = "1234"

class AccountRead(BaseModel):
    id: int
    name: str
    nickname: str | None = None
    currency: str
    type: str
    mask: str
    balance: Decimal

class AccountLinkRequest(BaseModel):
    username: str
    password: str
    account_type: str
    nickname: str | None = None
