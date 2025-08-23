from datetime import date, datetime, timedelta
from decimal import Decimal
import random
from typing import Optional
from sqlalchemy.orm import Session
from app.models.account import Account
from app.models.transaction import Transaction
from app.schemas.plaid_fake import PlaidAccount, PlaidTransaction, PlaidTransactionsGetResponse

RNG = random.Random(123)

def generate_realistic_transactions(db: Session, user_id: int, account_id: int, account_type: str, mask: str):
    """Generate realistic transactions based on account type"""
    today = date.today()
    balance = Decimal('0.00')
    
    if account_type == "checking":
        balance = generate_checking_transactions(db, user_id, account_id, today)
    elif account_type == "savings":
        balance = generate_savings_transactions(db, user_id, account_id, today)
    elif account_type == "trading":
        balance = generate_trading_transactions(db, user_id, account_id, today)
    else:
        balance = generate_checking_transactions(db, user_id, account_id, today)
    
    # Update account balance
    account = db.query(Account).filter(Account.id == account_id).first()
    if account:
        account.balance = balance
        db.commit()

def generate_checking_transactions(db: Session, user_id: int, account_id: int, today: date) -> Decimal:
    """Generate realistic checking account transactions"""
    balance = Decimal('0.00')
    
    # Generate 3 months of transactions
    for month_offset in range(3):
        month_date = today.replace(day=1) - timedelta(days=30 * month_offset)
        
        # Salary (1st of month)
        salary_amount = Decimal('3500.00')
        db.add(Transaction(
            user_id=user_id, account_id=account_id, date=month_date.replace(day=1),
            amount=salary_amount, category="salary", description="Monthly salary from Employer Inc"
        ))
        balance += salary_amount
        
        # Rent (3rd of month)
        rent_amount = Decimal('-1100.00')
        db.add(Transaction(
            user_id=user_id, account_id=account_id, date=month_date.replace(day=3),
            amount=rent_amount, category="rent", description="Monthly rent to My Landlord LLC"
        ))
        balance += rent_amount
        
        # Utilities (15th of month)
        utilities_amount = Decimal(f"-{round(RNG.uniform(90, 140), 2)}")
        db.add(Transaction(
            user_id=user_id, account_id=account_id, date=month_date.replace(day=15),
            amount=utilities_amount, category="utilities", description="City Utilities"
        ))
        balance += utilities_amount
        
        # Subscriptions (10th of month)
        subscriptions = ["Netflix", "Spotify", "iCloud", "Amazon Prime"]
        for subscription in subscriptions:
            sub_amount = Decimal(f"-{round(RNG.uniform(5, 20), 2)}")
            db.add(Transaction(
                user_id=user_id, account_id=account_id, date=month_date.replace(day=10),
                amount=sub_amount, category="subscriptions", description=f"{subscription} subscription"
            ))
            balance += sub_amount
        
        # Groceries (weekly)
        for week in [5, 12, 19, 26]:
            grocery_amount = Decimal(f"-{round(RNG.uniform(40, 120), 2)}")
            db.add(Transaction(
                user_id=user_id, account_id=account_id, date=month_date.replace(day=week),
                amount=grocery_amount, category="groceries", description="SuperMart groceries"
            ))
            balance += grocery_amount
        
        # Dining (random days)
        for _ in range(RNG.randint(2, 5)):
            day = RNG.choice([4, 8, 11, 13, 17, 20, 23, 27])
            dining_amount = Decimal(f"-{round(RNG.uniform(12, 40), 2)}")
            restaurant = RNG.choice(["PastaPlace", "BurgerHub", "SushiGo", "TacoBell", "McDonalds"])
            db.add(Transaction(
                user_id=user_id, account_id=account_id, date=month_date.replace(day=day),
                amount=dining_amount, category="dining", description=restaurant
            ))
            balance += dining_amount
        
        # Transportation
        for _ in range(6):
            day = RNG.choice([2, 6, 9, 14, 16, 18, 21, 24, 28])
            transport_amount = Decimal(f"-{round(RNG.uniform(8, 25), 2)}")
            service = RNG.choice(["Uber", "Lyft", "MetroCard", "Shell", "Exxon"])
            db.add(Transaction(
                user_id=user_id, account_id=account_id, date=month_date.replace(day=day),
                amount=transport_amount, category="transport", description=service
            ))
            balance += transport_amount
    
    db.commit()
    return balance

def generate_savings_transactions(db: Session, user_id: int, account_id: int, today: date) -> Decimal:
    """Generate realistic savings account transactions"""
    balance = Decimal('0.00')
    
    # Generate 3 months of transactions
    for month_offset in range(3):
        month_date = today.replace(day=1) - timedelta(days=30 * month_offset)
        
        # Monthly deposit (1st of month)
        deposit_amount = Decimal(f"{round(RNG.uniform(500, 1000), 2)}")
        db.add(Transaction(
            user_id=user_id, account_id=account_id, date=month_date.replace(day=1),
            amount=deposit_amount, category="savings", description="Monthly savings deposit"
        ))
        balance += deposit_amount
        
        # Interest (15th of month)
        interest_amount = Decimal(f"{round(RNG.uniform(5, 15), 2)}")
        db.add(Transaction(
            user_id=user_id, account_id=account_id, date=month_date.replace(day=15),
            amount=interest_amount, category="interest", description="Monthly interest earned"
        ))
        balance += interest_amount
        
        # Occasional withdrawals
        if RNG.random() < 0.3:  # 30% chance of withdrawal
            day = RNG.randint(10, 25)
            withdrawal_amount = Decimal(f"-{round(RNG.uniform(100, 300), 2)}")
            db.add(Transaction(
                user_id=user_id, account_id=account_id, date=month_date.replace(day=day),
                amount=withdrawal_amount, category="withdrawal", description="Savings withdrawal"
            ))
            balance += withdrawal_amount
    
    db.commit()
    return balance

def generate_trading_transactions(db: Session, user_id: int, account_id: int, today: date) -> Decimal:
    """Generate realistic trading account transactions"""
    balance = Decimal('0.00')
    
    # Initial deposit
    initial_deposit = Decimal('10000.00')
    db.add(Transaction(
        user_id=user_id, account_id=account_id, date=today - timedelta(days=90),
        amount=initial_deposit, category="deposit", description="Initial trading account deposit"
    ))
    balance += initial_deposit
    
    # Generate 3 months of trading activity
    for month_offset in range(3):
        month_date = today.replace(day=1) - timedelta(days=30 * month_offset)
        
        # Stock purchases/sales
        for _ in range(RNG.randint(3, 8)):
            day = RNG.randint(1, 28)
            if RNG.random() < 0.6:  # 60% chance of purchase
                amount = Decimal(f"-{round(RNG.uniform(100, 500), 2)}")
                stocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META"]
                stock = RNG.choice(stocks)
                db.add(Transaction(
                    user_id=user_id, account_id=account_id, date=month_date.replace(day=day),
                    amount=amount, category="investment", description=f"Purchase {stock} shares"
                ))
                balance += amount
            else:  # 40% chance of sale
                amount = Decimal(f"{round(RNG.uniform(100, 500), 2)}")
                stocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META"]
                stock = RNG.choice(stocks)
                db.add(Transaction(
                    user_id=user_id, account_id=account_id, date=month_date.replace(day=day),
                    amount=amount, category="investment", description=f"Sell {stock} shares"
                ))
                balance += amount
        
        # Dividends
        if RNG.random() < 0.4:  # 40% chance of dividends
            day = RNG.randint(10, 20)
            dividend_amount = Decimal(f"{round(RNG.uniform(10, 50), 2)}")
            db.add(Transaction(
                user_id=user_id, account_id=account_id, date=month_date.replace(day=day),
                amount=dividend_amount, category="dividend", description="Stock dividend payment"
            ))
            balance += dividend_amount
    
    db.commit()
    return balance

def link_fake_account(db: Session, user_id: int, username: str, account_type: str, nickname: str = None) -> Account:
    """Link a fake account and generate transactions"""
    # Generate a realistic mask from username
    mask = username[-4:] if len(username) >= 4 else username.zfill(4)
    
    # Check if account already exists
    existing = db.query(Account).filter(
        Account.user_id == user_id, 
        Account.type == account_type, 
        Account.mask == mask
    ).first()
    
    if existing:
        return existing
    
    # Create account name
    institution_names = {
        "checking": ["Chase Bank", "Bank of America", "Wells Fargo", "Citibank"],
        "savings": ["Ally Bank", "Marcus by Goldman Sachs", "Discover Bank", "Capital One"],
        "trading": ["Robinhood", "TD Ameritrade", "E*TRADE", "Charles Schwab"]
    }
    
    institution = RNG.choice(institution_names.get(account_type, ["Demo Bank"]))
    account_name = f"{institution} {account_type.capitalize()}"
    
    # Create the account
    account = Account(
        user_id=user_id,
        name=account_name,
        nickname=nickname,
        currency="USD",
        type=account_type,
        mask=mask,
        balance=Decimal('0.00')
    )
    
    db.add(account)
    db.commit()
    db.refresh(account)
    
    # Generate realistic transactions
    generate_realistic_transactions(db, user_id, account.id, account_type, mask)
    
    return account

def get_account_balance(db: Session, account_id: int) -> float:
    """Calculate account balance from transactions"""
    transactions = db.query(Transaction).filter(Transaction.account_id == account_id).all()
    total = sum(float(t.amount) for t in transactions)
    return total

def _map_local_to_plaidish(t: Transaction, account_id_label: str) -> PlaidTransaction:
    """Map local transaction to Plaid-like format"""
    amt = float(t.amount)
    name = t.description or t.category
    
    pfc_primary = {
        "salary": "INCOME_SALARY",
        "rent": "RENT_AND_UTILITIES",
        "utilities": "RENT_AND_UTILITIES",
        "subscriptions": "SUBSCRIPTIONS",
        "groceries": "FOOD_AND_DRINK",
        "dining": "FOOD_AND_DRINK",
        "transport": "TRANSPORTATION",
        "savings": "TRANSFER_IN",
        "interest": "INCOME_INTEREST",
        "withdrawal": "TRANSFER_OUT",
        "investment": "GENERAL_MERCHANDISE",
        "dividend": "INCOME_DIVIDEND",
        "deposit": "TRANSFER_IN"
    }.get(t.category, "GENERAL_MERCHANDISE")
    
    return PlaidTransaction(
        account_id=account_id_label,
        transaction_id=f"tx_{account_id_label}_{t.id}",
        name=name,
        merchant_name=t.description,
        amount=round(amt, 2),
        iso_currency_code="USD",
        date=t.date.isoformat(),
        authorized_date=t.date.isoformat(),
        pending=False,
        payment_channel="online",
        transaction_type="special",
        personal_finance_category={"primary": pfc_primary},
        location={"city": None, "region": None, "country": "US"},
        payment_meta={"reference_number": None},
    )

def plaidish_transactions_get(
    db: Session, 
    user_id: int, 
    account_id_label: str = "12345", 
    start_date: str = None, 
    end_date: str = None, 
    limit: int = 100, 
    offset: int = 0
) -> PlaidTransactionsGetResponse:
    """Get transactions in Plaid-like format"""
    # Find account by mask
    account = db.query(Account).filter(
        Account.user_id == user_id, 
        Account.mask == account_id_label
    ).first()
    
    if not account:
        raise ValueError(f"Account with mask {account_id_label} not found")
    
    # Query transactions
    q = db.query(Transaction).filter(
        Transaction.user_id == user_id, 
        Transaction.account_id == account.id
    )
    
    if start_date:
        q = q.filter(Transaction.date >= datetime.fromisoformat(start_date).date())
    if end_date:
        q = q.filter(Transaction.date <= datetime.fromisoformat(end_date).date())
    
    q = q.order_by(Transaction.date.desc())
    total = q.count()
    rows = q.offset(offset).limit(limit).all()
    
    txns = [_map_local_to_plaidish(t, account_id_label) for t in rows]
    
    accounts = [PlaidAccount(
        account_id=account_id_label, 
        name=account.name, 
        mask=account.mask,
        balances={"available": float(account.balance), "current": float(account.balance)}
    )]
    
    return PlaidTransactionsGetResponse(
        accounts=accounts,
        transactions=txns,
        total_transactions=total,
        item={"item_id": f"fake_item_{account_id_label}", "institution_id": "ins_fake_demo"},
        request_id=f"req_fake_{account_id_label}"
    )
