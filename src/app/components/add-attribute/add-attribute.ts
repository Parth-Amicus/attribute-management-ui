
import { Component, OnDestroy, OnInit } from '@angular/core';
import {AbstractControl,FormControl,FormGroup,ReactiveFormsModule,Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { AttributeService } from '../../services/attribute';
import { LookupService } from '../../services/lookup';
import { IAttribute } from '../../interface/attribute.interface';
import { IBusinessUnit } from '../../interface/business-unit.interface';
import { ICustomerLocation } from '../../interface/customer-location.interface';
import { ICompany } from '../../interface/company.interface';
import { attributeNameValidator } from '../../validator/attribute-name.validator';

@Component({
  selector: 'app-add-attribute',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './add-attribute.html',
  styleUrl: './add-attribute.css'
})
export class AddAttributeComponent implements OnInit, OnDestroy {

  businessUnits: IBusinessUnit[] = [];
  customerLocations: ICustomerLocation[] = [];
  companies: ICompany[] = [];

  submitted = false; // help to decide when to show error

  form = new FormGroup({
    attributeName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        attributeNameValidator
      ]
    }),

    businessId: new FormControl<number | null>(
      null,
      Validators.required
    ),

    customerLocationId: new FormControl<number | null>(
      { value: null, disabled: true },
      Validators.required
    ),

    companyId: new FormControl<number | null>(
      null,
      Validators.required
    ),

    isActive: new FormControl(true, {
      nonNullable: true
    })
  });

  private businessUnitSubscription?: Subscription;  /////////////////////////////////////////////

  constructor(
    private lookupService: LookupService,
    private attributeService: AttributeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.businessUnits = this.lookupService.getBusinessUnits(); // loads data for dropdown 
    this.companies = this.lookupService.getCompanies();// loads data for dropdown

    // refresh the available locations whenever the business unit changes as CL depends on BU
    this.businessUnitSubscription =
    // this.form.controls.businessId accesses the business unit form control 
      this.form.controls.businessId.valueChanges.subscribe(businessId => {
        this.customerLocations = businessId === null
          ? []
          : this.lookupService.getCustomerLocations(businessId);

        // A location selected for the previous business unit is no
        // longer valid, so clear it when the business unit changes
        this.form.controls.customerLocationId.reset(null);

        if (businessId === null) {
          this.form.controls.customerLocationId.disable();
        } else {
          this.form.controls.customerLocationId.enable();
        }
      });
  }

  isFieldInvalid(
    fieldName:| 'attributeName'| 'businessId'| 'customerLocationId'| 'companyId'): boolean {
    const control = this.form.controls[fieldName];

    return control.invalid && (control.touched || this.submitted);
  } // shows error only if invalid and touched or submitted

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue(); // retrive value of all the fields
 // additional safeguard 
    if (
      value.businessId === null ||
      value.customerLocationId === null ||
      value.companyId === null
    ) {
      return;
    }

    const businessUnit = this.businessUnits.find(
      item => item.BusinessId === value.businessId
    );

    const location = this.customerLocations.find(
      item => item.CustomerLocationId === value.customerLocationId
    );

    const company = this.companies.find(
      item => item.CompanyId === value.companyId
    );

    if (!businessUnit || !location || !company) {
      return;
    }

    const currentDate = new Date();

    const existingAttributes = this.attributeService.getAttributes();

    const nextId = existingAttributes.reduce(
      (maxId, attribute) => Math.max(maxId, attribute.AttributeId),
      0
    ) + 1;

    const newAttribute: IAttribute = {
      AttributeId: nextId,
      AttributeName: value.attributeName.trim(),
      BusinessUnitName: businessUnit.BusinessName,
      CustomerLocationName: location.CustomerLocationName,
      CompanyName: company.CompanyName,
      IsActive: value.isActive,
      CreatedOn: currentDate,
      CreatedBy: 'Current User',
      UpdatedOn: currentDate,
      UpdatedBy: 'Current User'
    };

    this.attributeService.addAttribute(newAttribute);

    // Return to the list after adding the record.
    void this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.businessUnitSubscription?.unsubscribe();
  }
}
