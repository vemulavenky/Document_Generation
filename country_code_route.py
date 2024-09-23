from typing import List
from fastapi import (
    APIRouter, 
    Depends,
    status
)
from app.models.base_response_model import ApiResponse
from app.models.country_code_model import CountryCodeRequest, CountryCodeResponse, GetAllCountryCodeResponse
from app.services.country_code_service import CountryCodeService 

router = APIRouter(prefix="/country_code", tags=["Country Code Management Service"])



@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[CountryCodeResponse]
)
async def create_country_code(
    request: CountryCodeRequest,
    service: CountryCodeService = Depends(CountryCodeService)
) -> ApiResponse[CountryCodeResponse]:
    return ApiResponse(data=service.create_country_code(request))

@router.get(
    "/all", 
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[List[GetAllCountryCodeResponse]]
)
async def get_all_country_codes(
    service: CountryCodeService = Depends(CountryCodeService)
) -> ApiResponse[List[GetAllCountryCodeResponse]]: 
    return ApiResponse(data=service.get_all_country_codes())