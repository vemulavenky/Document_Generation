from dataclasses import dataclass
from automapper import mapper
from fastapi import (
    Depends, 
)
from sqlalchemy.orm import Session
from app.connectors.database_connector import get_db
from app.entities.country_code import CountryCodes
from app.models.country_code_model import CountryCodeRequest, CountryCodeResponse, GetAllCountryCodeResponse 



@dataclass 

class CountryCodeService :
    db: Session = Depends(get_db) 


    def create_country_code(self, request: CountryCodeRequest) -> CountryCodeResponse:
        existing_country_code = self.db.query(CountryCodes).filter(
            CountryCodes.country_code == request.country_code.strip(),
            CountryCodes.isd_code == request.isd_code.strip(),
            CountryCodes.country_name == request.country_name.strip()
        ).first()

        if existing_country_code:
            return CountryCodeResponse(
                id=existing_country_code.isd_code,
                message="Country code already exists"
            )
        
        country_code = CountryCodes(
            country_code=request.country_code.strip(),
            isd_code=request.isd_code.strip(),
            country_name=request.country_name.strip()
        )
        self.db.add(country_code)
        self.db.commit()

        return CountryCodeResponse(
            id=country_code.isd_code,
            message=f"Country code '{country_code.isd_code}' has been created successfully."
        )

    def get_all_country_codes(self):
        country_codes = self.db.query(CountryCodes).all()
        sorted_country_codes = sorted(country_codes, key=lambda x: x.country_name)
        return [mapper.to(GetAllCountryCodeResponse).map(country_code) for country_code in sorted_country_codes]