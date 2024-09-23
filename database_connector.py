import os
from datetime import datetime
from dotenv import load_dotenv
import traceback
import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import (
    sessionmaker,
    Session
)
from app.utils.constants import (
    PUBLIC_SCHEMA
)

load_dotenv()  # Load environment variables from .env file

SQL_USER = os.getenv("POSTGRES_USER")
SQL_PASSWORD = os.getenv("POSTGRES_PASSWORD")
SQL_HOST = os.getenv("POSTGRES_HOST")
SQL_DB = os.getenv("POSTGRES_DB")
SQLALCHEMY_DATABASE_URL = f"postgresql://{SQL_USER}:{SQL_PASSWORD}@{SQL_HOST}/{SQL_DB}"
print("SQLALCHEMY_DATABASE_URL", SQLALCHEMY_DATABASE_URL)
db_connections: dict[str, dict[str, Session | datetime]] = {}

# Create a SQLAlchemy engine
engine = sa.create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=280,
    pool_size=200,
    max_overflow=0,
)
# Create a base class for declarative models
Base = declarative_base(metadata=sa.MetaData())


class SchemaNotFoundError(Exception):
    def __init__(self, id):
        self.message = "Schema %s not found!" % str(id)
        super().__init__(self.message)


def get_database():
    return build_db_session(PUBLIC_SCHEMA)


def build_db_session(schema: str) -> Session:
    if schema:
        schema_translate_map = dict(tenant=schema)
    else:
        raise SchemaNotFoundError("Schema %s not found!" % schema)
    connectable = engine.execution_options(schema_translate_map=schema_translate_map)
    connectable.dialect.default_schema_name = schema
    db = sessionmaker(bind=connectable, expire_on_commit=False)()
    db.execute(sa.text('set search_path to "%s"' % schema))
    return db


def get_connected_schema(db: Session) -> str:
    return db.connection().dialect.default_schema_name or ""


def get_db():
    print("Transaction starting, opening db. ", datetime.now())
    db = get_database()
    try:
        yield db
    finally:
        try:
            db.commit()
        except:
            traceback.print_exc()
            db.rollback()
        finally:
            db.close()
        print("Transaction completed, closing db. ", datetime.now())
