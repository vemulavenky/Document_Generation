from fastapi import (
    APIRouter, 
    Depends,
    status
)
from app.models.base_response_model import ApiResponse
from app.models.cost_center_model import CostCenterRequest, CostCenterResponse, GetAllCostCentersResponse
from app.services.cost_center_service import CostCenterService 

router = APIRouter(prefix="/cost_center", tags=["Cost Center Management Service"])


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[CostCenterResponse],
)
async def create_cost_center(
    request: CostCenterRequest,
    service: CostCenterService = Depends(CostCenterService)
) -> ApiResponse[CostCenterResponse]:
    return ApiResponse(data=service.create_cost_center(request))

@router.get(
    "/all", 
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[list[GetAllCostCentersResponse]]  
)
async def get_all_cost_centers(
    service: CostCenterService = Depends(CostCenterService)
) -> ApiResponse[list[GetAllCostCentersResponse]]:
    return ApiResponse(data=service.get_all_cost_centers()) 

@router.put(
    "/update/{cost_center}",
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[CostCenterResponse]
)
async def update_cost_center(
    cost_center: str,
    request : CostCenterRequest,
    service: CostCenterService = Depends(CostCenterService)
) -> ApiResponse[CostCenterResponse]:
    return ApiResponse(data=service.update_cost_center(cost_center, request))

    

@router.delete(
    "/delete/{cost_center_code}",
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[dict]
)
async def delete_cost_center(
    cost_center_code: str,
    service: CostCenterService = Depends(CostCenterService)
) -> ApiResponse[dict]:
    result = service.delete_cost_center(cost_center_code)
    return ApiResponse(data=result)
