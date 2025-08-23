import os

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pluto.db")
    APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT = int(os.getenv("APP_PORT", "8080"))
    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
    JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret_change_me")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRES_SECONDS = int(os.getenv("JWT_EXPIRES_SECONDS", "3600"))

settings = Settings()
