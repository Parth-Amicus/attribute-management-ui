import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ActivityService } from '../../../../core/services/activity';
import { AppStateStore } from '../../../../core/services/app-state-store';
import { AttributeService } from '../../../../core/services/attribute';
import { AuthService } from '../../../../core/services/auth';
import { LookupService } from '../../../../core/services/lookup';
import { IAttribute } from '../../../../interface/attribute.interface';
import { EditAttributeComponent as EditAttribute } from './edit-attribute';

describe('EditAttribute', () => {
  let component: EditAttribute;
  let fixture: ComponentFixture<EditAttribute>;

  const attribute: IAttribute = {
    AttributeId: 1,
    AttributeName: 'Employee Code',
    BusinessUnitName: 'Engineering',
    CustomerLocationName: 'Pune',
    CompanyName: 'Example',
    IsActive: true,
    CreatedOn: new Date('2024-01-01'),
    CreatedBy: 'Admin',
    UpdatedOn: new Date('2024-01-01'),
    UpdatedBy: 'Admin'
  };
  const businessUnits = [{ BusinessId: 1, BusinessName: 'Engineering' }];
  const customerLocations = [{ CustomerLocationId: 1, CustomerLocationName: 'Pune' }];
  const companies = [{ CompanyId: 1, CompanyName: 'Example' }];
  const lookups = { businessUnits, customerLocations, companies };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAttribute],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { attribute } } }
        },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: AttributeService, useValue: {} },
        {
          provide: LookupService,
          useValue: {
            getBusinessUnits: () => of(businessUnits),
            getCustomerLocations: () => of(customerLocations),
            getCompanies: () => of(companies)
          }
        },
        {
          provide: AppStateStore,
          useValue: { lookups$: of(lookups), currentState: { lookups } }
        },
        { provide: ActivityService, useValue: {} },
        { provide: AuthService, useValue: { currentUser: null } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAttribute);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the lookup selections after the lookup requests complete', () => {
    expect(component.selectedBusinessId).toBe(1);
    expect(component.selectedCustomerLocationId).toBe(1);
    expect(component.selectedCompanyId).toBe(1);
  });
});
