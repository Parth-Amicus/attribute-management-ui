
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
  ) {}

  ngOnInit(): void { //loading the initial data 
    this.businessUnits = this.lookupService.getBusinessUnits();
    this.companies = this.lookupService.getCompanies();

    const idParameter = this.route.snapshot.paramMap.get('id');
    const attributeId = Number(idParameter);

    if (!idParameter || !Number.isInteger(attributeId) || attributeId <= 0) {
      void this.router.navigate(['/attributes']);
      return;
    }

    const existingAttribute =this.attributeService.getAttributeById(attributeId);

    if (!existingAttribute) {
      void this.router.navigate(['/attributes']);
      return;
    }

    // Copy the record so typing does not immediately change the stored record
    this.model = {
      ...existingAttribute,
      CreatedOn: new Date(existingAttribute.CreatedOn),
      UpdatedOn: new Date(existingAttribute.UpdatedOn)
    };

    // Convert the saved names back to lookup IDs for the dropdowns
    const businessUnit = this.businessUnits.find(
      item => item.BusinessName === this.model.BusinessUnitName
    );

    this.selectedBusinessId = businessUnit?.BusinessId ?? null;

    if (this.selectedBusinessId !== null) {
      this.customerLocations =this.lookupService.getCustomerLocations(this.selectedBusinessId);

      const location = this.customerLocations.find(
        item =>
          item.CustomerLocationName === this.model.CustomerLocationName
      );

      this.selectedCustomerLocationId =
        location?.CustomerLocationId ?? null;
    }

    const company = this.companies.find(
      item => item.CompanyName === this.model.CompanyName
    );

    this.selectedCompanyId = company?.CompanyId ?? null;
  }

  onBusinessUnitChange(businessId: number | null): void {
    this.customerLocations = businessId === null? []: this.lookupService.getCustomerLocations(businessId);

    // A location selected for the previous business unit is no longer valid
    this.selectedCustomerLocationId = null;
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
 //updated values
    this.attributeService.updateAttribute(this.model);

    // Prevent the unsaved-changes guard from warning after a successful save.
    form.form.markAsPristine();

    void this.router.navigate(['/']);
  }

  canDeactivate(): boolean {
    if (!this.editForm?.dirty) {
      return true;
    }

    return window.confirm(
      'You have unsaved changes do you want to leave this page?'
    );
  }
}


//the update attribute () finds the exixting record with id and update it 