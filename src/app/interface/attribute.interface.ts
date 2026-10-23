//by default interface are private so to use it in other we have to use export
export interface IAttribute {
  AttributeId: number;
  AttributeName: string;
  BusinessUnitName: string;
  CustomerLocationName: string;
  CompanyName: string;
  IsActive: boolean;
  CreatedOn: Date;
  CreatedBy: string;
  UpdatedOn: Date;
  UpdatedBy: string;
}

