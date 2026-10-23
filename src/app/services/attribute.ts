
import { Injectable } from '@angular/core';
import { IAttribute } from '../interface/attribute.interface';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  /*
   * Provider scope:
   * providedIn: 'root' makes one shared service instance available
   * throughout the application
   *
   * If we provide this service in a component's providers array,
   * that component and its children use a separate service instance.
   * This can be useful when a component needs isolated data or state.
   * For this application, root-level sharing is appropriate because
   * the List, Add, and Edit components need to access the same data.
   */

//    Angular creates exactly one shared instance (a Singleton) of AttributeService for the entire app
//    No matter how many components request this service, they all talk to the same execution block and the same memory space

  private attributes: IAttribute[] = [
    {
      AttributeId: 1,
      AttributeName: 'Employee Code',
      BusinessUnitName: 'Human Resources',
      CustomerLocationName: 'Ahmedabad',
      CompanyName: 'Abc Technology',
      IsActive: true,
      CreatedOn: new Date('2024-01-10'), // using date object unlocks different methods 
      CreatedBy: 'Admin',
      UpdatedOn: new Date('2026-08-12'),
      UpdatedBy: 'Parth'
    },
    {
      AttributeId: 2,
      AttributeName: 'Invoice Number',
      BusinessUnitName: 'Finance',
      CustomerLocationName: 'Mumbai',
      CompanyName: 'Abc Consulting',
      IsActive: true,
      CreatedOn: new Date('2023-05-20'),
      CreatedBy: 'Neha',
      UpdatedOn: new Date('2026-09-05'),
      UpdatedBy: 'Rahul'
    },
    {
      AttributeId: 3,
      AttributeName: 'Project Code',
      BusinessUnitName: 'Engineering',
      CustomerLocationName: 'Pune',
      CompanyName: 'Abc Technology',
      IsActive: false,
      CreatedOn: new Date('2022-11-15'),
      CreatedBy: 'Amit',
      UpdatedOn: new Date('2025-04-18'),
      UpdatedBy: 'Neha'
    },
    {
      AttributeId: 4,
      AttributeName: 'Customer Reference',
      BusinessUnitName: 'Operations',
      CustomerLocationName: 'Bengaluru',
      CompanyName: 'Techno Consulting',
      IsActive: true,
      CreatedOn: new Date('2025-02-01'),
      CreatedBy: 'Rahul',
      UpdatedOn: new Date('2026-07-21'),
      UpdatedBy: 'Amit'
    },
    {
      AttributeId: 5,
      AttributeName: 'Department Name',
      BusinessUnitName: 'Human Resources',
      CustomerLocationName: 'Mumbai',
      CompanyName: 'Web Technology',
      IsActive: false,
      CreatedOn: new Date('2021-08-12'),
      CreatedBy: 'Neha',
      UpdatedOn: new Date('2024-10-10'),
      UpdatedBy: 'Admin'
    },
    {
      AttributeId: 6,
      AttributeName: 'Payment Status',
      BusinessUnitName: 'Finance',
      CustomerLocationName: 'Ahmedabad',
      CompanyName: 'Vamp Consulting',
      IsActive: true,
      CreatedOn: new Date('2024-06-25'),
      CreatedBy: 'Parth',
      UpdatedOn: new Date('2026-10-01'),
      UpdatedBy: 'Rahul'
    },
    {
      AttributeId: 7,
      AttributeName: 'Release Version',
      BusinessUnitName: 'Engineering',
      CustomerLocationName: 'Bengaluru',
      CompanyName: 'Amicus Technology',
      IsActive: true,
      CreatedOn: new Date('2025-09-08'),
      CreatedBy: 'Amit',
      UpdatedOn: new Date('2026-09-30'),
      UpdatedBy: 'Parth'
    },
    {
      AttributeId: 8,
      AttributeName: 'Delivery Status',
      BusinessUnitName: 'Operations',
      CustomerLocationName: 'Pune',
      CompanyName: 'Grounds Consulting',
      IsActive: false,
      CreatedOn: new Date('2023-03-14'),
      CreatedBy: 'Admin',
      UpdatedOn: new Date('2025-12-02'),
      UpdatedBy: 'Neha'
    }
  ];

  // Return a new array so callers cannot directly add/remove array entries
  getAttributes(): IAttribute[] {
    return [...this.attributes];
  }

  // Find one attribute by its ID
  getAttributeById(id: number): IAttribute | undefined {
    return this.attributes.find(
      attribute => attribute.AttributeId === id
    );
  }

  // Add a new attribute to the shared data
  addAttribute(attribute: IAttribute): void {
    this.attributes.push(attribute);
  }

  // Replace an existing attribute with its edited version
  updateAttribute(updatedAttribute: IAttribute): void {
    const index = this.attributes.findIndex(
      attribute => attribute.AttributeId === updatedAttribute.AttributeId
    );

    if (index !== -1) {
      this.attributes[index] = updatedAttribute;
    }
  }

  // Remove an attribute by its ID
  deleteAttribute(id: number): void {
    this.attributes = this.attributes.filter(
      attribute => attribute.AttributeId !== id
    );
  }
}
