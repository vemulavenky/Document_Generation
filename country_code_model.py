from pydantic import (
    BaseModel
) 


class CountryCodeRequest(BaseModel):
    country_code : str 
    isd_code : str 
    country_name : str  

class CountryCodeResponse(BaseModel):
    id: str
    message: str    


class GetAllCountryCodeResponse(BaseModel):
    country_code : str 
    isd_code : str 
    country_name : str 