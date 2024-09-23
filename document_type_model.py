from pydantic import (
    BaseModel
)


class DocumentTypeRequest(BaseModel):
    document_type: str


class DocumentTypeResponse(BaseModel):
    id: str
    message: str    


class GetAllDocumentTypeResponse(BaseModel):
    document_type_code: str
    document_type: str 