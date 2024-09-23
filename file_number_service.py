from dataclasses import dataclass
from datetime import datetime
from automapper import mapper
from fastapi import (
    Depends,
    status,
    HTTPException, 
)
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.connectors.database_connector import get_db
from app.entities.cost_center import CostCenter
from app.entities.country_code import CountryCodes
from app.entities.document_type import DocumentType
from app.entities.file_number import FileNumbers
from app.entities.project import Project
from app.models.file_number_model import (
    FileNumberDetail,
    FileNumberRequest, 
    FileNumberResponse_1,
    FileNumberWithDetailsResponse,
    GetFileNumberDataResponse
)
from app.utils.constants import (
    FILE_NUMBER_DATA_NOT_FOUND,
    INVALID_FILE_NUMBER_FORMAT,
    FILE_NUMBER_DOES_NOT_EXISTS, 
)

from sqlalchemy.orm import joinedload

@dataclass
class FileNumberService:
    db: Session = Depends(get_db)

    def generate_file_number(self, request: FileNumberRequest):
        latest_version = self.db.query(func.max(FileNumbers.file_version)).filter(
            FileNumbers.country_code == request.country_code,
            FileNumbers.cost_center_code == request.cost_center_code,
            FileNumbers.document_type_code == request.document_type_code,
            FileNumbers.project_code == request.project_code,
        ).scalar()

        if latest_version is None:
            new_version = 1 
        else:
            new_version = int(latest_version) + 1 

        new_version = f"{new_version:02d}"

        file_number = (
            f"{request.country_code}-{request.cost_center_code}-{request.project_code}-{request.document_type_code}-{new_version}"
        )

        new_file_number = FileNumbers(
            country_code=request.country_code,
            cost_center_code=request.cost_center_code,
            project_code=request.project_code,
            document_type_code=request.document_type_code,
            file_version=new_version,
            file_number=file_number,
            created_at=datetime.now().replace(microsecond=0),
            created_by=request.created_by,
            remarks = request.remarks
        )
        
        self.db.add(new_file_number)
        self.db.commit()

        return FileNumberResponse_1(
            generated_file_number=file_number

        )
   

    def get_file_number_data(self, file_number: str):
        try:
            country_code, cost_center_code, project_code, document_type_code, file_version = file_number.split('-')
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=INVALID_FILE_NUMBER_FORMAT
            )
        
        file_record = self.db.query(FileNumbers).filter(FileNumbers.file_number == file_number).first()

        if file_record is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=FILE_NUMBER_DOES_NOT_EXISTS
            )
        
        country = self.db.query(CountryCodes).filter(CountryCodes.isd_code == country_code).first()
        cost_center = self.db.query(CostCenter).filter(CostCenter.cost_center_code == cost_center_code).first()
        project = self.db.query(Project).filter(Project.project_code == project_code).first()
        document_type = self.db.query(DocumentType).filter(DocumentType.document_type_code == document_type_code).first()
        
        if not all([country, cost_center, project, document_type, file_record]):
            raise HTTPException(status_code=404, detail=FILE_NUMBER_DATA_NOT_FOUND)

        response_data = GetFileNumberDataResponse(
            country=country.country_name,
            cost_center=cost_center.cost_center,
            document_type=document_type.document_type,
            project=project.project_name,
            file_version=file_record.file_version,
            created_at=file_record.created_at,
            created_by=file_record.created_by, 
            remarks=file_record.remarks
        )
        
        return response_data
    
    def get_all_file_numbers(self) -> FileNumberWithDetailsResponse:
        file_numbers = self.db.query(
            FileNumbers.file_number,
            CountryCodes.country_name,
            CostCenter.cost_center,
            Project.project_name,
            DocumentType.document_type,
            FileNumbers.created_at,
            FileNumbers.remarks,
            FileNumbers.created_by
        ).join(
            CountryCodes, FileNumbers.country_code == CountryCodes.isd_code
        ).join(
            CostCenter, FileNumbers.cost_center_code == CostCenter.cost_center_code
        ).join(
            Project, FileNumbers.project_code == Project.project_code
        ).join(
            DocumentType, FileNumbers.document_type_code == DocumentType.document_type_code
        ).order_by(
        FileNumbers.created_at.desc() 
    ).all()

        file_numbers_with_details = [
            FileNumberDetail(
                file_number=fn.file_number,
                country_name=fn.country_name,
                cost_center_name=fn.cost_center,
                project_name=fn.project_name,
                document_type_name=fn.document_type,
                created_at=fn.created_at,
                remarks=fn.remarks,
                created_by=fn.created_by  
            ) for fn in file_numbers
        ]

        return FileNumberWithDetailsResponse(file_numbers=file_numbers_with_details)
