from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.init_db import init_db
from app.routers import auth, users, accounts, transactions, insights
from app.api import fake_plaid

app = FastAPI(title="Pluto API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(insights.router)
app.include_router(fake_plaid.router)

@app.on_event("startup")
def _startup():
    init_db()

@app.get("/healthz")
def healthz():
    return {"status": "ok"}
