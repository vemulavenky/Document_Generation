from typing import List
from fastapi import (
    APIRouter, 
    Depends,
    status
)
from app.models.base_response_model import ApiResponse
from app.models.project_model import (
    ProjectRequest, 
    ProjectResponse,
    GetProjectResponse
)
from app.services.project_service import ProjectCodeService

router = APIRouter(prefix="/project", tags=["Project Management Service"])


@router.post(
    "/create", 
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[ProjectResponse], 
)
async def create_project(
    request: ProjectRequest, 
    service: ProjectCodeService = Depends(ProjectCodeService)
) -> ApiResponse[ProjectResponse]:
    return ApiResponse(data=service.create_project(request))


@router.get(
    "/all", 
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[List[GetProjectResponse]]
) 
async def get_all_project(
    service: ProjectCodeService = Depends(ProjectCodeService)
) -> ApiResponse[List[GetProjectResponse]] : 
    return ApiResponse(data=service.get_all_project())


@router.put(
    "/update/{project_name}",
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[ProjectResponse]
)
async def update_project(
    project_name: str,
    request: ProjectRequest,
    service: ProjectCodeService = Depends(ProjectCodeService)
) -> ApiResponse[ProjectResponse]:
    return ApiResponse(data=service.update_project(project_name, request))



@router.delete(
    "/delete/{project_code}",
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[dict]
)
async def delete_project(
    project_code: str,
    service: ProjectCodeService = Depends(ProjectCodeService)
) -> ApiResponse[dict]:
    return ApiResponse(data=service.delete_project(project_code=project_code))