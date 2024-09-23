from typing import Optional
from pydantic import (
    BaseModel
)


class ProjectRequest(BaseModel):
    project_name: str


class ProjectResponse(BaseModel):
    id: str
    message: str    


class GetProjectResponse(BaseModel):
    project_code: str 
    project_name: str 