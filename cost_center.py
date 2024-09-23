import sqlalchemy as sa
from app.connectors.database_connector import Base

class CostCenter(Base):
    __tablename__ = 'cost_center'

    cost_center_code: str = sa.Column(sa.String(10), primary_key=True, nullable=False)
    cost_center: str = sa.Column(sa.String(100), unique=True, nullable=False) 

