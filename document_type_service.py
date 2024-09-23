from dataclasses import dataclass
from automapper import mapper
from fastapi import (
    Depends,
    HTTPException, 
    status
)
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.connectors.database_connector import get_db
from app.entities.document_type import DocumentType
from app.entities.file_number import FileNumbers
from app.models.document_type_model import (
    DocumentTypeRequest, 
    DocumentTypeResponse, 
    GetAllDocumentTypeResponse
)

from app.utils.constants import ( 
    CANNOT_DELETE_DOCUMENT_TYPE_BECAUSE_IT_HAS_RELATED_FILE_NUMBERS, DOCUMENT_TYPE_ALREADY_EXIST, 
    DOCUMENT_TYPE_HAS_BEEN_CREATED_SUCCESSFULLY_WITH_ID, 
    DOCUMENT_TYPE_HAS_BEEN_DELETED_SUCCESSFULLY_WITH_ID, 
    DOCUMENT_TYPE_HAS_BEEN_UPDATED_SUCCESSFULLY_WITH_ID, 
    DOCUMENT_TYPE_NOT_FOUND 
)


@dataclass 
class DocumentTypeService :
    db: Session = Depends(get_db) 


    def create_document_type(self, request: DocumentTypeRequest) -> DocumentTypeResponse:
        existing_document_type = self.db.query(DocumentType).filter(DocumentType.document_type == request.document_type.title().strip()).first()

        if existing_document_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=DOCUMENT_TYPE_ALREADY_EXIST
            )

        max_document_type_code = self.db.query(func.max(DocumentType.document_type_code)).scalar()

        if max_document_type_code is None:
            new_document_type_code = '01'
        else:
            new_document_type_code = f"{int(max_document_type_code) + 1:02d}"

        document_type = DocumentType(
            document_type_code=str(new_document_type_code),
            document_type=request.document_type.title().strip()
        )
        self.db.add(document_type)
        self.db.commit()

        return DocumentTypeResponse(
            id=document_type.document_type_code,
            message=f"{DOCUMENT_TYPE_HAS_BEEN_CREATED_SUCCESSFULLY_WITH_ID}'{document_type.document_type_code}' "
        )

    def get_all_document_types(self):
        document_types = self.db.query(DocumentType).all()
        return [mapper.to(GetAllDocumentTypeResponse).map(document_type) for document_type in document_types]
    
    def update_document_type(self, document_type: str, request: DocumentTypeRequest) -> DocumentTypeResponse:
        document_type = self.db.query(DocumentType).filter(
            DocumentType.document_type == document_type.strip()
        ).first()

        if not document_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=DOCUMENT_TYPE_NOT_FOUND
            )

        document_type.document_type = request.document_type.strip()
        self.db.commit()

        return DocumentTypeResponse(
            id=document_type.document_type_code,
            message=f"{DOCUMENT_TYPE_HAS_BEEN_UPDATED_SUCCESSFULLY_WITH_ID}'{document_type.document_type_code}'"
        )
    
    def delete_document_type(self, document_type_code: str):
        document_type = self.db.query(DocumentType).filter(
            DocumentType.document_type_code == document_type_code
        ).first()

        if not document_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=DOCUMENT_TYPE_NOT_FOUND
            )
        
        related_file_numbers = self.db.query(FileNumbers).filter(
            FileNumbers.document_type_code == document_type_code
        ).first()

        if related_file_numbers: 
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail= f"{CANNOT_DELETE_DOCUMENT_TYPE_BECAUSE_IT_HAS_RELATED_FILE_NUMBERS}'{document_type_code}' "
            )

        self.db.delete(document_type)
        self.db.commit()


        return DocumentTypeResponse(
          id=document_type.document_type_code,
          message=DOCUMENT_TYPE_HAS_BEEN_DELETED_SUCCESSFULLY_WITH_ID
       ).dict()