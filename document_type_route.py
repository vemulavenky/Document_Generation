from typing import List
from fastapi import (
    APIRouter, 
    Depends,
    status
)
from app.models.base_response_model import ApiResponse
from app.models.document_type_model import DocumentTypeRequest, DocumentTypeResponse, GetAllDocumentTypeResponse
from app.services.document_type_service import DocumentTypeService

router = APIRouter(prefix="/document_type", tags=["Document Type Management Service"])


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[DocumentTypeResponse],
)
async def create_document_type(
    request: DocumentTypeRequest,
    service: DocumentTypeService = Depends(DocumentTypeService)
) -> ApiResponse[DocumentTypeResponse]:
    return ApiResponse(data=service.create_document_type(request))

@router.get(
    "/all", 
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[List[GetAllDocumentTypeResponse]]
) 
async def get_all_document_types(
    service : DocumentTypeService = Depends(DocumentTypeService)
) -> ApiResponse[List[GetAllDocumentTypeResponse]]: 
    return ApiResponse(data=service.get_all_document_types()) 

@router.put(
    "/update/{document_type}",
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[DocumentTypeResponse]
)
async def update_document_type(
    document_type: str,
    request : DocumentTypeRequest,
    service: DocumentTypeService = Depends(DocumentTypeService)
) -> ApiResponse[DocumentTypeResponse]:
    return ApiResponse(data=service.update_document_type(document_type, request))


@router.delete(
    "/delete/{document_type_code}",
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[dict]
)
async def delete_document_type(
    document_type_code: str,
    service: DocumentTypeService = Depends(DocumentTypeService)
) -> ApiResponse[dict]:
    result = service.delete_document_type(document_type_code)
    return ApiResponse(data=result)