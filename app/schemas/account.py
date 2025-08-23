from pydantic import BaseModel

class AccountCreate(BaseModel):
    name: str
    currency: str = "USD"

class AccountRead(BaseModel):
    id: int
    name: str
    currency: str
