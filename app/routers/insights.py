from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, datetime, timedelta
from typing import List, Optional
from decimal import Decimal
import statistics
from app.deps import get_db, get_current_user
from app.models.transaction import Transaction
from app.models.account import Account
from app.models.user import User
from app.schemas.insight import (
    SpendingInsight, 
    CategoryBreakdown, 
    TrendAnalysis,
    FinancialSummary,
    MathematicalCalculations,
    PlutoScore
)

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/spending", response_model=SpendingInsight)
def get_spending_insights(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    days: int = Query(30, description="Number of days to analyze")
):
    """Get spending insights with mathematical calculations"""
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    # Get all transactions for the user in the date range
    transactions = db.query(Transaction).filter(
        and_(
            Transaction.user_id == current.id,
            Transaction.date >= start_date,
            Transaction.date <= end_date
        )
    ).all()
    
    # Mathematical calculations with validation
    expenses = []
    income = []
    for t in transactions:
        try:
            amount = float(t.amount)
            if not (amount == float('inf') or amount == float('-inf') or amount != amount):
                if amount < 0:
                    expenses.append(abs(amount))
                elif amount > 0:
                    income.append(amount)
        except (ValueError, TypeError):
            continue
    
    if not expenses:
        return SpendingInsight(
            total_spending=0,
            average_daily=0,
            top_category="",
            spending_trend="stable",
            category_breakdown=[],
            mathematical_insights=MathematicalCalculations(
                mean=0,
                median=0,
                standard_deviation=0,
                variance=0,
                min_value=0,
                max_value=0,
                total_transactions=0,
                income_total=sum(income) if income else 0,
                expense_total=0,
                net_flow=sum(income) if income else 0
            )
        )
    
    # Calculate mathematical statistics
    mean_expense = statistics.mean(expenses)
    median_expense = statistics.median(expenses)
    std_dev = statistics.stdev(expenses) if len(expenses) > 1 else 0
    variance = statistics.variance(expenses) if len(expenses) > 1 else 0
    
    # Category breakdown with calculations
    category_totals = {}
    for t in transactions:
        if t.amount < 0:
            category = t.category
            amount = abs(t.amount)
            if category not in category_totals:
                category_totals[category] = 0
            category_totals[category] += amount
    
    category_breakdown = [
        CategoryBreakdown(
            category=cat,
            total=total,
            percentage=round((total / sum(category_totals.values())) * 100, 2)
        )
        for cat, total in sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
    ]
    
    # Determine spending trend
    if len(expenses) >= 2:
        recent_expenses = expenses[:len(expenses)//2]
        older_expenses = expenses[len(expenses)//2:]
        recent_avg = statistics.mean(recent_expenses)
        older_avg = statistics.mean(older_expenses)
        
        if recent_avg > older_avg * 1.1:
            trend = "increasing"
        elif recent_avg < older_avg * 0.9:
            trend = "decreasing"
        else:
            trend = "stable"
    else:
        trend = "stable"
    
    return SpendingInsight(
        total_spending=sum(category_totals.values()),
        average_daily=round(sum(category_totals.values()) / days, 2),
        top_category=category_breakdown[0].category if category_breakdown else "",
        spending_trend=trend,
        category_breakdown=category_breakdown,
        mathematical_insights=MathematicalCalculations(
            mean=round(mean_expense, 2),
            median=round(median_expense, 2),
            standard_deviation=round(std_dev, 2),
            variance=round(variance, 2),
            min_value=round(min(expenses), 2),
            max_value=round(max(expenses), 2),
            total_transactions=len(transactions),
            income_total=round(sum(income), 2) if income else 0,
            expense_total=round(sum(expenses), 2),
            net_flow=round(sum(income) - sum(expenses), 2) if income else -sum(expenses)
        )
    )

@router.get("/mathematical-summary", response_model=MathematicalCalculations)
def get_mathematical_summary(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    account_id: Optional[str] = Query(None, description="Specific account ID"),
    days: int = Query(30, description="Number of days to analyze")
):
    # Validate account_id if provided
    if account_id is not None and account_id != "None":
        try:
            account_id_int = int(account_id)
            # Check if the account belongs to the current user
            try:
                account = db.query(Account).filter(
                    and_(
                        Account.id == account_id_int,
                        Account.user_id == current.id
                    )
                ).first()
                if not account:
                    raise HTTPException(status_code=404, detail="Account not found or access denied")
            except Exception as e:
                # Log the error and continue without account validation
                print(f"Error validating account {account_id_int}: {e}")
                pass
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid account_id parameter")
    """Get comprehensive mathematical calculations for financial data"""
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    # Build query
    query = db.query(Transaction).filter(
        and_(
            Transaction.user_id == current.id,
            Transaction.date >= start_date,
            Transaction.date <= end_date
        )
    )
    
    if account_id is not None and account_id != "None":
        try:
            account_id_int = int(account_id)
            query = query.filter(Transaction.account_id == account_id_int)
        except (ValueError, TypeError):
            # If account_id is invalid, just continue without filtering
            pass
    
    transactions = query.all()
    
    if not transactions:
        return MathematicalCalculations(
            mean=0, median=0, standard_deviation=0, variance=0,
            min_value=0, max_value=0, total_transactions=0,
            income_total=0, expense_total=0, net_flow=0
        )
    
    # Ensure we have valid numeric data
    valid_amounts = []
    for t in transactions:
        try:
            amount = float(t.amount)
            if not (amount == float('inf') or amount == float('-inf') or amount != amount):  # Check for inf, -inf, NaN
                valid_amounts.append(amount)
        except (ValueError, TypeError):
            continue
    
    if not valid_amounts:
        return MathematicalCalculations(
            mean=0, median=0, standard_deviation=0, variance=0,
            min_value=0, max_value=0, total_transactions=0,
            income_total=0, expense_total=0, net_flow=0
        )
    
    # Separate income and expenses
    amounts = valid_amounts
    income = [amt for amt in amounts if amt > 0]
    expenses = [abs(amt) for amt in amounts if amt < 0]
    
    # Calculate statistics
    mean_amount = statistics.mean(amounts)
    median_amount = statistics.median(amounts)
    std_dev = statistics.stdev(amounts) if len(amounts) > 1 else 0
    variance = statistics.variance(amounts) if len(amounts) > 1 else 0
    
    return MathematicalCalculations(
        mean=round(mean_amount, 2),
        median=round(median_amount, 2),
        standard_deviation=round(std_dev, 2),
        variance=round(variance, 2),
        min_value=round(min(amounts), 2),
        max_value=round(max(amounts), 2),
        total_transactions=len(transactions),
        income_total=round(sum(income), 2) if income else 0,
        expense_total=round(sum(expenses), 2) if expenses else 0,
        net_flow=round(sum(income) - sum(expenses), 2) if income and expenses else (sum(income) if income else -sum(expenses))
    )

@router.get("/trend-analysis", response_model=TrendAnalysis)
def get_trend_analysis(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    days: int = Query(90, description="Number of days to analyze")
):
    """Get trend analysis with mathematical calculations"""
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    # Get daily spending data
    daily_data = db.query(
        Transaction.date,
        func.sum(func.abs(Transaction.amount)).label('daily_total')
    ).filter(
        and_(
            Transaction.user_id == current.id,
            Transaction.date >= start_date,
            Transaction.date <= end_date,
            Transaction.amount < 0
        )
    ).group_by(Transaction.date).order_by(Transaction.date).all()
    
    if not daily_data:
        return TrendAnalysis(
            trend_direction="stable",
            trend_strength=0,
            volatility=0,
            prediction_next_week=0,
            mathematical_analysis="Insufficient data for analysis"
        )
    
    daily_totals = []
    for d in daily_data:
        try:
            total = float(d.daily_total)
            if not (total == float('inf') or total == float('-inf') or total != total):
                daily_totals.append(total)
        except (ValueError, TypeError):
            continue
    
    # Calculate trend using linear regression
    n = len(daily_totals)
    if n >= 2:
        x_values = list(range(n))
        y_values = daily_totals
        
        # Simple linear regression
        x_mean = statistics.mean(x_values)
        y_mean = statistics.mean(y_values)
        
        numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(x_values, y_values))
        denominator = sum((x - x_mean) ** 2 for x in x_values)
        
        if denominator != 0:
            slope = numerator / denominator
            trend_direction = "increasing" if slope > 0 else "decreasing" if slope < 0 else "stable"
            trend_strength = abs(slope)
        else:
            trend_direction = "stable"
            trend_strength = 0
    else:
        trend_direction = "stable"
        trend_strength = 0
    
    # Calculate volatility (standard deviation)
    volatility = statistics.stdev(daily_totals) if len(daily_totals) > 1 else 0
    
    # Simple prediction for next week
    if daily_totals:
        recent_avg = statistics.mean(daily_totals[-7:]) if len(daily_totals) >= 7 else statistics.mean(daily_totals)
        prediction_next_week = round(recent_avg * 7, 2)
    else:
        prediction_next_week = 0
    
    # Mathematical analysis summary
    if n >= 10:
        analysis = f"Based on {n} days of data. Trend: {trend_direction}, Volatility: {volatility:.2f}, Prediction: ${prediction_next_week:.2f}"
    elif n >= 5:
        analysis = f"Limited data ({n} days). Trend: {trend_direction}, Volatility: {volatility:.2f}"
    else:
        analysis = f"Insufficient data ({n} days) for reliable analysis"
    
    return TrendAnalysis(
        trend_direction=trend_direction,
        trend_strength=round(trend_strength, 4),
        volatility=round(volatility, 2),
        prediction_next_week=prediction_next_week,
        mathematical_analysis=analysis
    )

@router.get("/financial-summary", response_model=FinancialSummary)
def get_financial_summary(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user)
):
    """Get comprehensive financial summary with all mathematical calculations"""
    # Get all user accounts
    accounts = db.query(Account).filter(Account.user_id == current.id).all()
    
    # Get all transactions
    transactions = db.query(Transaction).filter(Transaction.user_id == current.id).all()
    
    if not transactions:
        return FinancialSummary(
            total_balance=0,
            total_income=0,
            total_expenses=0,
            net_worth=0,
            account_count=len(accounts),
            mathematical_summary=MathematicalCalculations(
                mean=0, median=0, standard_deviation=0, variance=0,
                min_value=0, max_value=0, total_transactions=0,
                income_total=0, expense_total=0, net_flow=0
            )
        )
    
    # Calculate totals with validation
    total_balance = 0
    for acc in accounts:
        try:
            balance = float(acc.balance)
            if not (balance == float('inf') or balance == float('-inf') or balance != balance):
                total_balance += balance
        except (ValueError, TypeError):
            continue
    
    amounts = []
    for t in transactions:
        try:
            amount = float(t.amount)
            if not (amount == float('inf') or amount == float('-inf') or amount != amount):
                amounts.append(amount)
        except (ValueError, TypeError):
            continue
    
    total_income = sum(amt for amt in amounts if amt > 0)
    total_expenses = sum(abs(amt) for amt in amounts if amt < 0)
    net_worth = total_income - total_expenses
    
    # Get mathematical summary
    math_summary = get_mathematical_summary(db, current, None, 365)
    
    return FinancialSummary(
        total_balance=round(total_balance, 2),
        total_income=round(total_income, 2),
        total_expenses=round(total_expenses, 2),
        net_worth=round(net_worth, 2),
        account_count=len(accounts),
        mathematical_summary=math_summary
    )

@router.get("/debug-params")
def debug_parameters(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    account_id: Optional[str] = Query(None, description="Debug account ID parameter")
):
    """Debug endpoint to check parameter handling"""
    return {
        "account_id_raw": account_id,
        "account_id_type": str(type(account_id)),
        "account_id_is_none": account_id is None,
        "account_id_equals_none_string": account_id == "None",
        "user_id": current.id
    }

@router.get("/pluto-score", response_model=PlutoScore)
def pluto_score(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    """Calculate Pluto financial health score with mathematical analysis"""
    since = date.today() - timedelta(days=30)
    # Get income and spending with validation
    income_result = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current.id, Transaction.date >= since, Transaction.amount > 0
    ).scalar() or 0
    
    spend_result = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current.id, Transaction.date >= since, Transaction.amount < 0
    ).scalar() or 0
    
    try:
        income = float(income_result)
        spend = abs(float(spend_result))
        
        # Validate the values
        if income == float('inf') or income == float('-inf') or income != income:
            income = 0
        if spend == float('inf') or spend == float('-inf') or spend != spend:
            spend = 0
    except (ValueError, TypeError):
        income = 0
        spend = 0
    savings_rate = (income - spend) / income if income > 0 else 0.0
    distinct_cats = db.query(Transaction.category).filter(
        Transaction.user_id == current.id, Transaction.date >= since, Transaction.category.isnot(None)
    ).distinct().count()
    diversity = min(distinct_cats, 6) / 6.0
    score = max(0, min(100, round((0.7 * savings_rate + 0.3 * diversity) * 100, 2)))
    return PlutoScore(
        score=score,
        window_days=30,
        income_30d=round(income, 2),
        spend_30d=round(spend, 2),
        savings_rate=round(savings_rate, 3),
        category_diversity=distinct_cats,
    )
