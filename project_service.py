from dataclasses import dataclass
from automapper import mapper
from fastapi import (
    Depends, 
    HTTPException,
    status
)
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.connectors.database_connector import get_db
from app.entities.file_number import FileNumbers
from app.entities.project import Project
from app.models.project_model import (
    ProjectRequest, 
    ProjectResponse,
    GetProjectResponse
)
from app.utils.constants import (
    CANNOT_DELETE_PROJECT_NAME_BECAUSE_IT_HAS_RELATED_FILE_NUMBERS,
    PROJECT_HAS_BEEN_CREATED_SUCCESSFULLY_WITH_ID,
    PROJECT_HAS_BEEN_DELETED_SUCCESSFULLY_WITH_ID,
    PROJECT_HAS_BEEN_UPDATED_SUCCESSFULLY_UPDATED_WITH_ID,
    PROJECT_NAME_ALREADY_EXIST,
    PROJECT_NOT_FOUND
) 


@dataclass 
class ProjectCodeService :
    db: Session = Depends(get_db) 

    def create_project(self, request: ProjectRequest) -> ProjectResponse:
        existing_project = self.db.query(Project).filter(Project.project_name == request.project_name.title().strip()).first()

        if existing_project:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=PROJECT_NAME_ALREADY_EXIST
            )

        max_project_code = self.db.query(func.max(Project.project_code)).scalar()

        if max_project_code is None:
            new_project_code = '001'
        else:
            new_project_code = f"{int(max_project_code) + 1:03d}"

        project = Project(
            project_code=str(new_project_code),
            project_name=request.project_name.title().strip()
        )
        self.db.add(project)
        self.db.commit()

        return ProjectResponse(
            id=project.project_code,
            message=f"{PROJECT_HAS_BEEN_CREATED_SUCCESSFULLY_WITH_ID} '{project.project_code}'"
        )


    def get_all_project(self):
        project_names = self.db.query(Project).order_by(Project.project_code.asc()).all()
        return [mapper.to(GetProjectResponse).map(project_name) for project_name in project_names]

    
    def update_project(self, project_name: str, request: ProjectRequest) -> ProjectResponse:
        project = self.db.query(Project).filter(
            Project.project_name == project_name.strip()
        ).first()

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= PROJECT_NOT_FOUND
            )

        project.project_name = request.project_name.title().strip()
        self.db.commit()

        return ProjectResponse(
            id=project.project_code,
            message=f"{PROJECT_HAS_BEEN_UPDATED_SUCCESSFULLY_UPDATED_WITH_ID}'{project.project_code}'"
        )
    

    def delete_project(self, project_code: str):
        project = self.db.query(Project).filter(Project.project_code == project_code).first()

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=PROJECT_NOT_FOUND
            )
        
        related_file_numbers = self.db.query(FileNumbers).filter(FileNumbers.project_code == project_code).all()

        if related_file_numbers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=CANNOT_DELETE_PROJECT_NAME_BECAUSE_IT_HAS_RELATED_FILE_NUMBERS
            )

        self.db.delete(project)
        self.db.commit() 


        return ProjectResponse(
            id=project.project_code,
            message=PROJECT_HAS_BEEN_DELETED_SUCCESSFULLY_WITH_ID
        ).dict()