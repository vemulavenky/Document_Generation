from dataclasses import dataclass
from automapper import mapper
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from app.connectors.database_connector import get_db
from app.entities.user import User  
from app.models.user_model import CreateUserRequest, UserResponse, UserResponseAllFields
from app.utils.constants import (
     EMAIL_ID_NOT_FOUND,
     ROLE_UPDATED_SUCCESSFULLY, 
     USER_CREATED_SUCCESSFULLY, 
     USER_EMAIL_ID_ALREADY_EXIST
)

@dataclass
class UserService:
    db: Session = Depends(get_db) 


    def create_user(self, user_data: CreateUserRequest) -> UserResponse:
        existing_user = self.db.query(User).filter(User.email_id == user_data.email_id).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail= USER_EMAIL_ID_ALREADY_EXIST
            )
        
        new_user = User(
            email_id=user_data.email_id,
            role=user_data.role,
            name=user_data.name
        )

        self.db.add(new_user)
        self.db.commit()
        
        return UserResponse(
            id=new_user.id,
            message=f"{USER_CREATED_SUCCESSFULLY} '{new_user.email_id}'"
        )
            


    def get_user_details(self, email_id: str) -> UserResponseAllFields:
        user_details = self.db.query(User).filter(User.email_id == email_id).first()
        
        if not user_details:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"'{email_id}' {EMAIL_ID_NOT_FOUND}"
            ) 
        
        return  UserResponseAllFields(
            name=user_details.name,
            email_id=user_details.email_id,
            role=user_details.role
        ) 
    

    def update_user_role(self, request: CreateUserRequest) :
        
        user_existing = self.db.query(User).filter(User.email_id == request.email_id, User.name == request.name).first() 

        if not user_existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=EMAIL_ID_NOT_FOUND
            ) 
        
        if user_existing.role == request.role :
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=USER_EMAIL_ID_ALREADY_EXIST
            )
        
        user_existing.role = request.role
        self.db.commit()

        return UserResponse(
            id=user_existing.id,
            message=f"{ROLE_UPDATED_SUCCESSFULLY} '{user_existing.email_id}' to '{request.role}'"
        )