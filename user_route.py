from fastapi import APIRouter, Depends, status
from app.models.base_response_model import ApiResponse
from app.models.user_model import CreateUserRequest, UserResponse, UserResponseAllFields
from app.services.user_service import UserService

router = APIRouter(prefix="/user", tags=["User Management Service"]) 




@router.post(
    "/create", 
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[UserResponse]
)
async def create_user(
    user_data: CreateUserRequest,
    service: UserService = Depends(UserService)
) -> ApiResponse[UserResponse]:
    user = service.create_user(user_data)
    return ApiResponse(data=user)

@router.get(
    "/{email_id}", 
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[UserResponseAllFields]
)
async def get_user_details(
    email_id: str,
    service: UserService = Depends(UserService)
) -> ApiResponse[UserResponseAllFields]:
    return ApiResponse(data=service.get_user_details(email_id))


@router.put(
    "/update-role", 
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[UserResponse]
)
async def update_user_role(
    request: CreateUserRequest,
    service: UserService = Depends(UserService)
) -> ApiResponse[UserResponse]:
    updated_role = service.update_user_role(request
    )
    return ApiResponse(data=updated_role)