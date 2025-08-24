from sqlalchemy import String, Integer, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Account(Base):
    __tablename__ = "accounts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    nickname: Mapped[str | None] = mapped_column(String(255), nullable=True)
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    type: Mapped[str] = mapped_column(String(32), default="checking")
    mask: Mapped[str] = mapped_column(String(8), default="1234")
    balance: Mapped[Numeric] = mapped_column(Numeric(12, 2), default=0.00)

    owner = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")
