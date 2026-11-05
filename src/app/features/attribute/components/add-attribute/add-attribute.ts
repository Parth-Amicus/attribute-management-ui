
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivityService } from '../../../../core/services/activity';
import { AuthService } from '../../../../core/services/auth';
import { AttributeService } from '../../../../core/services/attribute';
import { LookupService } from '../../../../core/services/lookup';
import { AppStateStore, ILookupState } from '../../../../core/services/app-state-store';
import { IAttribute } from '../../../../interface/attribute.interface';
import { attributeNameValidator } from '../../../../validator/attribute-name.validator';

@Component({
  selector: 'app-add-attribute',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, AsyncPipe], //router link helps to navigate to diff url
  templateUrl: './add-attribute.html',
  styleUrl: './add-attribute.css'
})
export class AddAttributeComponent implements OnInit, OnDestroy {

  // Lookup data now comes from the centralized AppStateStore
  lookups$: Observable<ILookupState>;

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
    private store: AppStateStore,
    private router: Router,
    private activityService: ActivityService,
    private authService: AuthService
  ) {
    this.lookups$ = this.store.lookups$;
  }

  ngOnInit(): void {

    // Loads business units from the API for the dropdown
    // LookupService updates the centralized store with the API response
    this.lookupService.getBusinessUnits().subscribe({
      error: error => {
        console.error('Failed to load business units:', error);
      }
    });

    // Loads companies from the API for the dropdown
    // LookupService updates the centralized store with the API response
    this.lookupService.getCompanies().subscribe({
      error: error => {
        console.error('Failed to load companies:', error);
      }
    });

    // refresh the available locations whenever the business unit changes as CL depends on BU
    this.businessUnitSubscription =
      // this.form.controls.businessId accesses the business unit form control
      this.form.controls.businessId.valueChanges.subscribe(businessId => {

        if (businessId === null) {
          this.form.controls.customerLocationId.reset(null);
          this.form.controls.customerLocationId.disable();
          return;
        }

        // A location selected for the previous business unit is no
        // longer valid, so clear it when the business unit changes
        this.form.controls.customerLocationId.reset(null);

        // Fetch locations belonging to the selected business unit.
        // LookupService saves the returned locations in AppStateStore.
        this.lookupService.getCustomerLocations(businessId).subscribe({
          error: error => {
            console.error('Failed to load customer locations:', error);
          }
        });

        this.form.controls.customerLocationId.enable();
      });
  }

  isFieldInvalid(
    fieldName: 'attributeName' | 'businessId' | 'customerLocationId' | 'companyId'
  ): boolean {
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

    // Get the latest lookup values from the centralized store
    const lookups = this.store.currentState.lookups;

    const businessUnit = lookups.businessUnits.find(
      item => item.BusinessId === value.businessId
    );

    const location = lookups.customerLocations.find(
      item => item.CustomerLocationId === value.customerLocationId
    );

    const company = lookups.companies.find(
      item => item.CompanyId === value.companyId
    );

    if (!businessUnit || !location || !company) {
      return;
    }

    const currentDate = new Date();

    const newAttribute: IAttribute = {
      AttributeId: 0,
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

    this.attributeService.addAttribute(newAttribute).subscribe({
      next: createdAttribute => {

        // Record the successful create operation.
        this.activityService.addActivity(
          'Created',
          createdAttribute.AttributeName,
          this.authService.currentUser?.username ?? 'Unknown'
        );

        void this.router.navigate(['/attributes']);
      },
      error: error => {
        console.error('Failed to add attribute:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.businessUnitSubscription?.unsubscribe();
  }
}
