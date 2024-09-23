from dataclasses import dataclass
from automapper import mapper
from fastapi import (
    Depends, 
    HTTPException,
    status
)
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.connectors.database_connector import get_db
from app.entities.cost_center import CostCenter
from app.entities.file_number import FileNumbers
from app.models.cost_center_model import CostCenterRequest, CostCenterResponse, GetAllCostCentersResponse
from app.utils.constants import (
    CANNOT_DELETE_COSTCENTER_BECAUSE_IT_HAS_RELATED_FILE_NUMBERS,
    COST_CENTER_NAME_ALREADY_EXIST, 
    COSTCENTER_HAS_BEEN_CREATED_SUCCESSFULLY_WITH_ID, 
    COSTCENTER_HAS_BEEN_DELETED_SUCCESSFULLY_WITH_ID, 
    COSTCENTER_HAS_BEEN_UPDATED_SUCCESSFULLY_UPDATED_WITH_ID, 
    COSTCENTER_NOT_FOUND
)

@dataclass
class CostCenterService:
    db: Session = Depends(get_db) 


    def create_cost_center(self, request: CostCenterRequest) -> CostCenterResponse:
        existing_cost_center = self.db.query(CostCenter).filter(CostCenter.cost_center == request.cost_center.strip()).first()

        if existing_cost_center:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=COST_CENTER_NAME_ALREADY_EXIST
            )

        max_cost_center_code = self.db.query(func.max(CostCenter.cost_center_code)).scalar()

        if max_cost_center_code is None:
            new_cost_center_code = '001'
        else:
            new_cost_center_code = f"{int(max_cost_center_code) + 1:03d}"

        cost_center = CostCenter(
            cost_center_code=str(new_cost_center_code),
            cost_center=request.cost_center.title().strip()
        )
        self.db.add(cost_center)
        self.db.commit()

        return CostCenterResponse(
            id=cost_center.cost_center_code,
            message=COSTCENTER_HAS_BEEN_CREATED_SUCCESSFULLY_WITH_ID
        )



    def get_all_cost_centers(self):
        cost_centers = self.db.query(CostCenter).all()
        return [mapper.to(GetAllCostCentersResponse).map(cost_center) for cost_center in cost_centers] 
    

    def update_cost_center(self, cost_center: str, request: CostCenterRequest) -> CostCenterResponse:
        cost_center = self.db.query(CostCenter).filter(
            CostCenter.cost_center == cost_center.strip()
        ).first()

        if not cost_center:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=COSTCENTER_NOT_FOUND
            )

        cost_center.cost_center = request.cost_center.strip()
        self.db.commit()

        return CostCenterResponse(
            id=cost_center.cost_center_code,
            message=COSTCENTER_HAS_BEEN_UPDATED_SUCCESSFULLY_UPDATED_WITH_ID
        )


    def delete_cost_center(self, cost_center_code: str):
        cost_center = self.db.query(CostCenter).filter(
            CostCenter.cost_center_code == cost_center_code
        ).first()

        if not cost_center:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=COSTCENTER_NOT_FOUND
            )

        related_file_numbers = self.db.query(FileNumbers).filter(
            FileNumbers.cost_center_code == cost_center_code
        ).first()

        if related_file_numbers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail= CANNOT_DELETE_COSTCENTER_BECAUSE_IT_HAS_RELATED_FILE_NUMBERS
            )

        self.db.delete(cost_center)
        self.db.commit()

        return CostCenterResponse(
          id=cost_center.cost_center_code,
          message=COSTCENTER_HAS_BEEN_DELETED_SUCCESSFULLY_WITH_ID
       ).dict()


    