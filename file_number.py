from datetime import date
import sqlalchemy as sa 
from app.connectors.database_connector import Base 


class FileNumbers(Base):
    __tablename__ = 'file_number'

    file_number_id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True, nullable=False)
    country_code: str = sa.Column(sa.String(5), sa.ForeignKey('country_codes.isd_code'), nullable=False)
    cost_center_code: str = sa.Column(sa.String(10), sa.ForeignKey('cost_center.cost_center_code'), nullable=False)
    project_code: str = sa.Column(sa.String(10), sa.ForeignKey('project.project_code'), nullable=False)
    document_type_code: str = sa.Column(sa.String(10), sa.ForeignKey('document_type.document_type_code'), nullable=False)
    file_version: str = sa.Column(sa.String(10), nullable=False)
    file_number: str = sa.Column(sa.String(100), unique=True, nullable=False) 
    created_at: date  = sa.Column(sa.DateTime, nullable=False) 
    created_by: str = sa.Column(sa.String(50), nullable=True)
    remarks: str = sa.Column(sa.String, nullable=True)