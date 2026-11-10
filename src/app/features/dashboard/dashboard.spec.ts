import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject, of } from 'rxjs';
import { DashboardComponent } from './dashboard';
import { AttributeService } from '../../core/services/attribute';
import { ActivityService, IActivity } from '../../core/services/activity';
import { IAttribute } from '../../interface/attribute.interface';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const attributesSubject = new Subject<IAttribute[]>();
  const attributes: IAttribute[] = [{
    AttributeId: 1,
    AttributeName: 'Employee Code',
    BusinessUnitName: 'Human Resources',
    CustomerLocationName: 'Mumbai',
    CompanyName: 'Example',
    IsActive: true,
    CreatedOn: new Date('2024-01-01'),
    CreatedBy: 'Admin',
    UpdatedOn: new Date('2024-01-01'),
    UpdatedBy: 'Admin'
  }];
  const activity: IActivity = {
    id: 1,
    action: 'Created',
    attributeName: 'Employee Code',
    performedBy: 'Admin',
    performedAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    attributesSubject.next([]);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: AttributeService,
          useValue: { getAttributes: () => attributesSubject.asObservable() }
        },
        {
          provide: ActivityService,
          useValue: { activities$: of([activity]) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the summary and business unit chart when attributes load', async () => {
    attributesSubject.next(attributes);
    await fixture.whenStable();

    expect(component.totalAttributes).toBe(1);
    expect(component.activeAttributes).toBe(1);
    expect(component.businessUnitChartData[0].businessUnitName).toBe('Human Resources');
    expect(fixture.nativeElement.textContent).toContain('Human Resources');
    expect(fixture.nativeElement.textContent).toContain('Created attribute: Employee Code');
  });
});
