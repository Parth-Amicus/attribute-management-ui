
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AttributeService } from '../../../../core/services/attribute';
import { LookupService } from '../../../../core/services/lookup';

import { IAttribute } from '../../../../interface/attribute.interface';
import { IBusinessUnit } from '../../../../interface/business-unit.interface';
import { ICustomerLocation } from '../../../../interface/customer-location.interface';
import { ICompany } from '../../../../interface/company.interface';

@Component({
  selector: 'app-edit-attribute', //selector identifies this component in HTML
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-attribute.html',
  styleUrl: './edit-attribute.css'
})
export class EditAttributeComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm; // gives ts class access to the form in html

  businessUnits: IBusinessUnit[] = [];
  customerLocations: ICustomerLocation[] = [];
  companies: ICompany[] = [];

  selectedBusinessId: number | null = null;
  selectedCustomerLocationId: number | null = null;
  selectedCompanyId: number | null = null;

  submitted = false;

  // A separate copy prevents unsaved changes from modifying the service data
  model: IAttribute = {
    AttributeId: 0,
    AttributeName: '',
    BusinessUnitName: '',
    CustomerLocationName: '',
    CompanyName: '',
    IsActive: true,
    CreatedOn: new Date(),
    CreatedBy: '',
    UpdatedOn: new Date(),
    UpdatedBy: ''
  };

  constructor(
    private route: ActivatedRoute, //reads attribute id from url
    private router: Router,
    private attributeService: AttributeService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {

    // Get the attribute already fetched by the Resolver
    const existingAttribute = this.route.snapshot.data['attribute'] as IAttribute;

    // Copy the resolved record so typing does not immediately change stored data
    this.model = {
      ...existingAttribute,
      CreatedOn: new Date(existingAttribute.CreatedOn),
      UpdatedOn: new Date(existingAttribute.UpdatedOn)
    };

    // Load Business Units from API
    this.lookupService.getBusinessUnits().subscribe({
      next: businessUnits => {
        this.businessUnits = businessUnits;

        // Convert the saved business unit name back to its lookup ID
        const businessUnit = this.businessUnits.find(
          item => item.BusinessName === this.model.BusinessUnitName
        );

        this.selectedBusinessId = businessUnit?.BusinessId ?? null;

        // Load locations only after the business units are available
        if (this.selectedBusinessId !== null) {
          this.loadCustomerLocations(this.selectedBusinessId);
        }
      },
      error: error => {
        console.error('Failed to load business units:', error);
      }
    });

    // Load Companies from API
    this.lookupService.getCompanies().subscribe({
      next: companies => {
        this.companies = companies;

        const company = this.companies.find(
          item => item.CompanyName === this.model.CompanyName
        );

        this.selectedCompanyId = company?.CompanyId ?? null;
      },
      error: error => {
        console.error('Failed to load companies:', error);
      }
    });
  }

  // Fetch locations belonging to the selected business unit
  private loadCustomerLocations(businessId: number): void {
    this.lookupService.getCustomerLocations(businessId).subscribe({
      next: locations => {
        this.customerLocations = locations;

        // Find the previously selected location when editing
        const location = this.customerLocations.find(
          item =>
            item.CustomerLocationName === this.model.CustomerLocationName
        );

        this.selectedCustomerLocationId =
          location?.CustomerLocationId ?? null;
      },
      error: error => {
        console.error('Failed to load customer locations:', error);
      }
    });
  }

  onBusinessUnitChange(businessId: number | null): void {

    // A location selected for the previous business unit is no longer valid
    this.selectedCustomerLocationId = null;
    this.customerLocations = [];

    if (businessId === null) {
      return;
    }

    this.loadCustomerLocations(businessId);
  }

  onSubmit(form: NgForm): void {
    this.submitted = true;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const businessUnit = this.businessUnits.find(
      item => item.BusinessId === this.selectedBusinessId
    );

    const location = this.customerLocations.find(
      item =>
        item.CustomerLocationId === this.selectedCustomerLocationId
    );

    const company = this.companies.find(
      item => item.CompanyId === this.selectedCompanyId
    );

    if (!businessUnit || !location || !company) {
      return;
    }

    this.model.BusinessUnitName = businessUnit.BusinessName;
    this.model.CustomerLocationName = location.CustomerLocationName;
    this.model.CompanyName = company.CompanyName;
    this.model.UpdatedOn = new Date();
    this.model.UpdatedBy = 'Current User';

    // Update attribute through API
    this.attributeService.updateAttribute(this.model).subscribe({
      next: updatedAttribute => {
        console.log('Attribute updated successfully:', updatedAttribute);

        // Prevent the unsaved-changes guard from warning after a successful save.
        form.form.markAsPristine();

        void this.router.navigate(['/attributes']);
      },
      error: error => {
        console.error('Failed to update attribute:', error);
      }
    });
  }

  canDeactivate(): boolean {
    if (this.editForm?.dirty) {
      return confirm(
        'You have unsaved changes. Are you sure you want to leave this page?'
      );
    }

    return true;
  }
}


//the update attribute () finds the exixting record with id and update it
