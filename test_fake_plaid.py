#!/usr/bin/env python3
"""
Test script for the fake Plaid functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.db.init_db import init_db
from app.models.user import User
from app.models.account import Account
from app.models.transaction import Transaction
from app.services.fake_plaid import link_fake_account, plaidish_transactions_get
from app.core.security import hash_password

def test_fake_plaid():
    """Test the fake Plaid functionality"""
    print("🚀 Testing Fake Plaid Implementation...")
    
    # Initialize database
    print("📊 Initializing database...")
    init_db()
    
    # Create a test user
    db = SessionLocal()
    try:
        # Check if test user exists
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                email="test@example.com",
                hashed_password=hash_password("testpassword"),
                full_name="Test User"
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"✅ Created test user: {test_user.email}")
        else:
            print(f"✅ Using existing test user: {test_user.email}")
        
        # Test linking different account types
        account_types = ["checking", "savings", "trading"]
        
        for account_type in account_types:
            print(f"\n🔗 Testing {account_type} account linking...")
            
            # Link account
            account = link_fake_account(
                db=db,
                user_id=test_user.id,
                username=f"testuser_{account_type}",
                account_type=account_type,
                nickname=f"My {account_type.capitalize()}"
            )
            
            print(f"   ✅ Linked {account_type} account: {account.name}")
            print(f"   📍 Mask: ••••{account.mask}")
            print(f"   💰 Balance: ${account.balance}")
            
            # Get transaction count
            transaction_count = db.query(Transaction).filter(
                Transaction.account_id == account.id
            ).count()
            print(f"   📊 Transactions generated: {transaction_count}")
            
            # Test Plaid-like transaction retrieval
            try:
                plaid_response = plaidish_transactions_get(
                    db=db,
                    user_id=test_user.id,
                    account_id_label=account.mask,
                    limit=10
                )
                print(f"   ✅ Plaid API response: {len(plaid_response.transactions)} transactions")
            except Exception as e:
                print(f"   ❌ Plaid API error: {e}")
        
        # Show summary
        print(f"\n📈 Summary:")
        total_accounts = db.query(Account).filter(Account.user_id == test_user.id).count()
        total_transactions = db.query(Transaction).filter(Transaction.user_id == test_user.id).count()
        print(f"   Total accounts: {total_accounts}")
        print(f"   Total transactions: {total_transactions}")
        
        # Show account balances
        accounts = db.query(Account).filter(Account.user_id == test_user.id).all()
        print(f"\n💰 Account Balances:")
        for account in accounts:
            print(f"   {account.nickname or account.name}: ${account.balance}")
        
        print(f"\n🎉 Fake Plaid test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_fake_plaid()
