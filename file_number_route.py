
from fastapi import (
    APIRouter, 
    Depends,
    HTTPException,
    status
)
from app.models.base_response_model import ApiResponse
from app.models.file_number_model import (
    FileNumberRequest, 
    FileNumberResponse,
    FileNumberResponse_1,
    GetFileNumberDataResponse
)
from app.services.file_number_service import FileNumberService

router = APIRouter(prefix="/file_number", tags=["File Number Management Service"])


@router.post(
    "/create", 
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[FileNumberResponse_1],
)
async def generate_file_number(
    request: FileNumberRequest, 
    service: FileNumberService = Depends(FileNumberService)
) -> ApiResponse[FileNumberResponse_1]:
    return ApiResponse(data=service.generate_file_number(request))



@router.get(
    "/all",
    status_code=status.HTTP_200_OK,
    response_model=FileNumberResponse,
)
async def get_all_file_numbers(
    service: FileNumberService = Depends()
) -> FileNumberResponse:
    try:
        file_numbers_with_details = service.get_all_file_numbers() 
        response = FileNumberResponse(
            status_message="SUCCESS",
            data=file_numbers_with_details,
            totalItems=len(file_numbers_with_details.file_numbers) 
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@router.get(
    "/{file_number}", 
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[GetFileNumberDataResponse],
)
async def get_file_number_data(
    file_number: str, 
    service: FileNumberService = Depends(FileNumberService)
) -> ApiResponse[GetFileNumberDataResponse]:
    return ApiResponse(data=service.get_file_number_data(file_number))