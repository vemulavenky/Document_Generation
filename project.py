import sqlalchemy as sa
from app.connectors.database_connector import Base


class Project(Base):
    __tablename__ = 'project'

    project_code: str = sa.Column(sa.String(10), primary_key=True, unique=True, nullable=False)
    project_name: str = sa.Column(sa.String(50), unique=True, nullable=False)
