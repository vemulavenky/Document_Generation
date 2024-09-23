import sqlalchemy as sa
from app.connectors.database_connector import Base


class CountryCodes(Base):
    __tablename__ = 'country_codes'

    country_code : str = sa.Column(sa.String(5), primary_key=True, nullable=False)
    isd_code : str = sa.Column(sa.String(10), unique=True, nullable=False)
    country_name : str = sa.Column(sa.String(100), unique=True, nullable=False) 