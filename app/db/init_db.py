from app.db.session import engine
from app.db.base import Base
from app.models import user, account, transaction  # noqa: F401

def init_db():
    Base.metadata.create_all(bind=engine)
