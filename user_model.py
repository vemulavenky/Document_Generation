from pydantic import (
    BaseModel
) 

from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    name: str
    email_id: str
    role: str

class UserResponseAllFields(BaseModel):
    name: str
    email_id: str
    role: str
   


class UserResponse(BaseModel):
    id: int
    message: str 