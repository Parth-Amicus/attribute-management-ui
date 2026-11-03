
import { Injectable } from '@angular/core';

import { AttributeDTO } from '../../interface/attribute.dto';
import { IAttribute } from '../../interface/attribute.interface';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  // Convert API DTO into the frontend model
  toAttribute(dto: AttributeDTO): IAttribute {
    return {
       AttributeId: dto.id,
      AttributeName: dto.attribute_name,
      BusinessUnitName: dto.business_unit_name,
      CustomerLocationName: dto.customer_location_name,
      CompanyName: dto.company_name,
      IsActive: dto.is_active,
      CreatedOn: new Date(dto.created_on),
      CreatedBy: dto.created_by,
      UpdatedOn: new Date(dto.updated_on),
      UpdatedBy: dto.updated_by
    };
  }

  // Convert frontend model into API DTO
  toDTO(attribute: IAttribute): AttributeDTO {
    return {
      id: attribute.AttributeId,
      attribute_name: attribute.AttributeName,
      business_unit_name: attribute.BusinessUnitName,
      customer_location_name: attribute.CustomerLocationName,
      company_name: attribute.CompanyName,
      is_active: attribute.IsActive,
      created_on: attribute.CreatedOn.toISOString(),
      created_by: attribute.CreatedBy,
      updated_on: attribute.UpdatedOn.toISOString(),
      updated_by: attribute.UpdatedBy
    };
  }
}
