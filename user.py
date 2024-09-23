import sqlalchemy as sa
from app.connectors.database_connector import Base


class User(Base):
    __tablename__ = 'users'

    id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True, nullable=False)
    name : str = sa.Column(sa.String(50), nullable=False)
    email_id: str = sa.Column(sa.String(100), unique=True, nullable=False)
    role : str = sa.Column(sa.String(50), nullable=False)
    