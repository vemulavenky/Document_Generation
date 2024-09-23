from datetime import date, datetime
from typing import List, Optional
from pydantic import (
    BaseModel
) 

class FileNumberRequest(BaseModel):
    cost_center_code: str 
    country_code: str 
    document_type_code: str
    project_code: str 
    remarks : str 
    created_by: str


class FileNumberResponse_1(BaseModel): 
    generated_file_number: str 
    message : str
    
class GetAllFileNumbers(BaseModel):
    file_number_id: int
    country_code : str
    cost_center_code: str
    project_code: str 
    document_type_code: str
    file_version: str
    file_number : str
    created_at: datetime 


class FileNumberWithRemarks(BaseModel):
    file_number: str
    remarks: Optional[str] = None 


class GetFileNumberDataResponse(BaseModel):
    country: str 
    cost_center: str 
    document_type: str
    project: str 
    file_version: str
    created_at: datetime 
    created_by: Optional[str]  
    remarks: Optional[str] 


class FileNumberDetail(BaseModel):
    file_number: str
    country_name: str
    cost_center_name: str
    project_name: str
    document_type_name: str
    created_at: datetime
    remarks: Optional[str] = None 
    created_by: Optional[str] = None


class FileNumberWithDetailsResponse(BaseModel):
    file_numbers: List[FileNumberDetail]


class FileNumberResponse(BaseModel):
    status_message: str
    data: FileNumberWithDetailsResponse
    totalItems: int
