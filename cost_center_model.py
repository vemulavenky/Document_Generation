from pydantic import (
    BaseModel
) 


class CostCenterRequest(BaseModel):
    cost_center: str


class CostCenterResponse(BaseModel):
    id: str
    message: str    


class GetAllCostCentersResponse(BaseModel):
    cost_center_code: str
    cost_center: str