from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class MathematicalCalculations(BaseModel):
    """Mathematical calculations and statistics"""
    mean: float
    median: float
    standard_deviation: float
    variance: float
    min_value: float
    max_value: float
    total_transactions: int
    income_total: float
    expense_total: float
    net_flow: float

class CategoryBreakdown(BaseModel):
    """Category breakdown with calculations"""
    category: str
    total: float
    percentage: float

class SpendingInsight(BaseModel):
    """Spending insights with mathematical analysis"""
    total_spending: float
    average_daily: float
    top_category: str
    spending_trend: str  # "increasing", "decreasing", "stable"
    category_breakdown: List[CategoryBreakdown]
    mathematical_insights: MathematicalCalculations

class TrendAnalysis(BaseModel):
    """Trend analysis with mathematical calculations"""
    trend_direction: str  # "increasing", "decreasing", "stable"
    trend_strength: float
    volatility: float
    prediction_next_week: float
    mathematical_analysis: str

class FinancialSummary(BaseModel):
    """Comprehensive financial summary"""
    total_balance: float
    total_income: float
    total_expenses: float
    net_worth: float
    account_count: int
    mathematical_summary: MathematicalCalculations

class PlutoScore(BaseModel):
    """Pluto financial health score"""
    score: float
    window_days: int
    income_30d: float
    spend_30d: float
    savings_rate: float
    category_diversity: int
