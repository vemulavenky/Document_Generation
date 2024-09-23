import sqlalchemy as sa
from app.connectors.database_connector import Base



class DocumentType(Base):
    __tablename__ = 'document_type'

    document_type_code: str = sa.Column(sa.String(10), primary_key=True, unique=True, nullable=False)
    document_type: str = sa.Column(sa.String(50), unique=True, nullable=False)
