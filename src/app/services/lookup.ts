
import { Injectable } from '@angular/core';
import { IBusinessUnit } from '../interface/business-unit.interface';
import { ICustomerLocation } from '../interface/customer-location.interface';
import { ICompany } from '../interface/company.interface';

// Internal type: associates each location with a business unit.
// BusinessId is used for filtering but is not part of ICustomerLocation.
interface LocationLookup extends ICustomerLocation {
  BusinessId: number;
}

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private businessUnits: IBusinessUnit[] = [
    { BusinessId: 1, BusinessName: 'Engineering' },
    { BusinessId: 2, BusinessName: 'Finance' },
    { BusinessId: 3, BusinessName: 'Human Resources' },
    { BusinessId: 4, BusinessName: 'Operations' }
  ];

  private locations: LocationLookup[] = [
    { CustomerLocationId: 1, CustomerLocationName: 'Pune', BusinessId: 1 },
    { CustomerLocationId: 2, CustomerLocationName: 'Bengaluru', BusinessId: 1 },
    { CustomerLocationId: 3, CustomerLocationName: 'Mumbai', BusinessId: 2 },
    { CustomerLocationId: 4, CustomerLocationName: 'Ahmedabad', BusinessId: 2 },
    { CustomerLocationId: 5, CustomerLocationName: 'Ahmedabad', BusinessId: 3 },
    { CustomerLocationId: 6, CustomerLocationName: 'Mumbai', BusinessId: 3 },
    { CustomerLocationId: 7, CustomerLocationName: 'Bengaluru', BusinessId: 4 },
    { CustomerLocationId: 8, CustomerLocationName: 'Pune', BusinessId: 4 }
  ];

  private companies: ICompany[] = [
    { CompanyId: 1, CompanyName: 'Abc Technology' },
    { CompanyId: 2, CompanyName: 'Abc Consulting' },
    { CompanyId: 3, CompanyName: 'Abc Solutions' }
  ];

  getBusinessUnits(): IBusinessUnit[] {
    return [...this.businessUnits];
  }

  getCustomerLocations(businessId: number): ICustomerLocation[] {
    return this.locations
      .filter(location => location.BusinessId === businessId)
      .map(location => ({
        CustomerLocationId: location.CustomerLocationId,
        CustomerLocationName: location.CustomerLocationName
      }));
  }

  getCompanies(): ICompany[] {
    return [...this.companies];
  }
}
