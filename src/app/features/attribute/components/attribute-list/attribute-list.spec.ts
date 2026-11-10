import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AttributeListComponent } from './attribute-list';
import { AttributeService } from '../../../../core/services/attribute';
import { AppStateStore } from '../../../../core/services/app-state-store';
import { AuthService } from '../../../../core/services/auth';
import { ToastService } from '../../../../core/services/toast';
import { ActivityService } from '../../../../core/services/activity';
import { IAttribute } from '../../../../interface/attribute.interface';

describe('AttributeList', () => {
  let component: AttributeListComponent;
  let fixture: ComponentFixture<AttributeListComponent>;
  let getAttributesPage: ReturnType<typeof vi.fn>;
  let firstAttribute: IAttribute;
  let secondAttribute: IAttribute;

  beforeEach(async () => {
    firstAttribute = {
      AttributeId: 1,
      AttributeName: 'Employee Code',
      BusinessUnitName: 'People',
      CustomerLocationName: 'Mumbai',
      CompanyName: 'Example',
      IsActive: true,
      CreatedOn: new Date('2024-01-01'),
      CreatedBy: 'Admin',
      UpdatedOn: new Date('2024-01-01'),
      UpdatedBy: 'Admin'
    };
    secondAttribute = {
      ...firstAttribute,
      AttributeId: 2,
      AttributeName: 'Department'
    };
    const refreshedRows: IAttribute[] = [
      { ...secondAttribute, AttributeName: 'Updated Department' },
      { ...firstAttribute, AttributeId: 3, AttributeName: 'Office Location' }
    ];
    getAttributesPage = vi.fn(() => of({
      data: refreshedRows,
      totalRecords: refreshedRows.length
    }));

    await TestBed.configureTestingModule({
      imports: [AttributeListComponent],
      providers: [
        provideRouter([]),
        {
          provide: AttributeService,
          useValue: {
            getAttributes: () => of([]),
            getAttributesPage,
            deleteAttribute: () => of(undefined)
          }
        },
        { provide: AppStateStore, useValue: { attributes$: of([]) } },
        { provide: AuthService, useValue: { currentUser: null, logout: vi.fn() } },
        { provide: ToastService, useValue: { show: vi.fn() } },
        { provide: ActivityService, useValue: { addActivity: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeListComponent);
    component = fixture.componentInstance;
    component.tableRows = [firstAttribute, secondAttribute];
    component.totalRecords = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refreshes from the API and reuses row nodes for matching attribute IDs', () => {
    const originalRowNodes = Array.from(
      fixture.nativeElement.querySelectorAll('tbody tr')
    ) as HTMLTableRowElement[];

    const refreshButton = fixture.nativeElement.querySelector(
      '.refresh-button'
    ) as HTMLButtonElement;
    refreshButton.click();
    fixture.detectChanges();

    const refreshedRowNodes = Array.from(
      fixture.nativeElement.querySelectorAll('tbody tr')
    ) as HTMLTableRowElement[];

    expect(getAttributesPage).toHaveBeenCalledWith(1, 5, 'attribute_name', 'asc', '');
    expect(refreshedRowNodes).toHaveLength(2);
    expect(refreshedRowNodes[0]).toBe(originalRowNodes[1]);
    expect(refreshedRowNodes[1]).not.toBe(originalRowNodes[0]);
    expect(refreshedRowNodes[0].textContent).toContain('Updated Department');
    expect(refreshedRowNodes[1].textContent).toContain('Office Location');
  });
});
