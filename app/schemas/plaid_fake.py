from pydantic import BaseModel
from typing import Optional, List, Dict

class PlaidAccount(BaseModel):
    account_id: str
    name: str
    official_name: Optional[str] = "Checking"
    subtype: str = "checking"
    type: str = "depository"
    mask: Optional[str] = "1234"
    balances: Dict[str, float] = {"available": 2200.0, "current": 2350.0}
    iso_currency_code: str = "USD"

class PlaidTransaction(BaseModel):
    account_id: str
    transaction_id: str
    name: str
    merchant_name: Optional[str] = None
    amount: float
    iso_currency_code: str = "USD"
    date: str  # "YYYY-MM-DD"
    authorized_date: Optional[str] = None
    pending: bool = False
    payment_channel: str = "online"  # or "in store"
    transaction_type: Optional[str] = "special"
    personal_finance_category: Dict[str, str] = {"primary": "GENERAL_MERCHANDISE"}
    location: Dict[str, Optional[str]] = {"city": None, "region": None, "country": "US"}
    payment_meta: Dict[str, Optional[str]] = {"reference_number": None}

class PlaidTransactionsGetResponse(BaseModel):
    accounts: List[PlaidAccount]
    transactions: List[PlaidTransaction]
    total_transactions: int
    item: Dict[str, str] = {"item_id": "fake_item_001", "institution_id": "ins_fake_001"}
    request_id: str = "req_fake_0001"
