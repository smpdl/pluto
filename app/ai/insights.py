from app.models.gemini_insight import GeminiInsight
import datetime
from app.db.session import SessionLocal
from app.models.transaction import Transaction
import google.generativeai as genai
import os
import json
import re
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Any

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_all_transactions() -> List[Dict[str, Any]]:
    """Fetches all transactions from the database."""
    db = SessionLocal()
    try:
        transactions = db.query(Transaction).all()
        return [
            {
                "id": t.id,
                "user_id": t.user_id,
                "account_id": t.account_id,
                "date": str(t.date),
                "amount": float(t.amount),
                "category": t.category,
                "description": t.description,
            }
            for t in transactions
        ]
    finally:
        db.close()

def ask_gemini_for_insights(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    prompt = (
        "Given the following list of financial transactions, "
        "generate a single JSON object with financial insights and recommendations. "
        "The object should have a key 'insights' which is an array of insight objects. "
        "Each insight object should follow this format: "
        "{\n  'id': 1,\n  'type': 'spending_reduction|emergency_fund|cash_flow|subscriptions|goals',\n  'title': 'Engaging headline (max 60 chars)',\n  'description': 'Helpful explanation with data (max 100 chars)',\n  'action_text': 'Button text (max 20 chars)',\n  'trend_direction': 'up|down|neutral',\n  'impact_level': 'high|medium|low',\n  'priority': 1,\n  'data_points': {\n    'primary_metric': 'Main number/percentage',\n    'comparison_period': 'Context period',\n    'supporting_details': 'Additional context'\n  }\n}\n"
        "Transactions: " + str(transactions)
    )
    model = genai.GenerativeModel("gemini-2.5-flash")
    try:
        response = model.generate_content(prompt)
        raw_text = response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raw_text = None

    if not raw_text:
        return _create_fallback_insight("Gemini did not return any content.")
    cleaned_text = re.sub(r'^```json\s*|^```\s*|```$', '', raw_text, flags=re.MULTILINE).strip()
    try:
        data = json.loads(cleaned_text)        
        if isinstance(data, dict) and "insights" in data and isinstance(data["insights"], list):
            return data
        else:
            print("Gemini response was not in the expected JSON format.")
            return _create_fallback_insight("Gemini returned an invalid JSON structure.")
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON from Gemini response: {e}")
        print(f"Raw response: {raw_text}")
        return _create_fallback_insight("Failed to parse Gemini's JSON response.")

def _create_fallback_insight(description: str) -> Dict[str, Any]:
    return {
        "insights": [
            {
                "id": 0,
                "type": "goals",
                "title": "No insights available",
                "description": description,
                "action_text": "Try Again",
                "trend_direction": "neutral",
                "impact_level": "low",
                "priority": 1,
                "data_points": {
                    "primary_metric": "N/A",
                    "comparison_period": "N/A",
                    "supporting_details": "N/A"
                }
            }
        ]
    }

def get_financial_insights() -> Dict[str, Any]:
    user_id = 1
    db = SessionLocal()
    try:
        latest = db.query(GeminiInsight).filter(GeminiInsight.user_id == user_id).order_by(GeminiInsight.created_at.desc()).first()
        now = datetime.datetime.utcnow()
        
        if latest and (now - latest.created_at).days < 30:
            return json.loads(latest.insights_json)

        transactions = get_all_transactions()
        result = ask_gemini_for_insights(transactions)

        insight_obj = GeminiInsight(
            user_id=user_id,
            created_at=now,
            insights_json=json.dumps(result)
        )
        db.add(insight_obj)
        db.commit()
        return result

    except SQLAlchemyError as e:
        print(f"Database error during insight retrieval or saving: {e}")
        db.rollback()
        transactions = get_all_transactions()
        result = ask_gemini_for_insights(transactions)
        insights = result.get("insights")
        if insights and isinstance(insights, list) and len(insights) > 0 and insights[0]["id"] != 0:
            try:
                insight_obj = GeminiInsight(
                    user_id=user_id,
                    created_at=now,
                    insights_json=json.dumps(result)
                )
                db.add(insight_obj)
                db.commit()
            except SQLAlchemyError as e:
                print("Error saving Gemini insight:", e)
                db.rollback()
        db.close()
        return result