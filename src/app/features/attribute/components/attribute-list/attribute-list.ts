
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AttributeService } from '../../../../core/services/attribute';
import { IAttribute } from '../../../../interface/attribute.interface';
import { AttributeCardComponent } from '../attribute-card/attribute-card';
import { ActiveStatusDirective } from '../../../../shared/directives/active-status';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time-pipe';
import { Router, RouterLink } from '@angular/router'; //lets user to navigate to different url - used in html
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, of, startWith, switchMap, tap } from 'rxjs';
import { AppStateStore } from '../../../../core/services/app-state-store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth';
import { ToastService } from '../../../../core/services/toast';
import { ActivityService } from '../../../../core/services/activity';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { IDataTableColumn } from '../../../../shared/components/data-table/data-table';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [
    RouterLink,
    AttributeCardComponent,
    ActiveStatusDirective,
    RelativeTimePipe,
    ConfirmDialogComponent,
    DataTableComponent
  ],
  templateUrl: './attribute-list.html', // html gets access to attributes from here
  styleUrl: './attribute-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeListComponent implements OnInit {

  attributes: IAttribute[] = []; //array of type attribute interface to hold the displayed records

  // Controls whether the delete confirmation dialog is visible
  showDeleteDialog = false;

  // Stores the attribute selected for deletion
  selectedAttribute: IAttribute | null = null;

  // Observable that provides attributes from the centralized store.
  attributes$: Observable<IAttribute[]>;

  // the table is the default view
  viewMode: 'table' | 'card' = 'table';

  searchControl = new FormControl('', { nonNullable: true });
  isSearching = true;
  searchError = '';
  private searchVersion = 0;
  // Checks whether the currently logged-in user is an Admin.
  get isAdmin(): boolean {
    return this.authService.currentUser?.role === 'Admin';
  }
  get isLoggedIn(): boolean {
    return this.authService.currentUser !== null;
  }
  constructor(
    private attributeService: AttributeService,
    private destroyRef: DestroyRef,
    private changeDetector: ChangeDetectorRef,
    private store: AppStateStore,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private activityService: ActivityService
  ) {
    // Components read attributes from the centralized store.
    this.attributes$ = this.store.attributes$;
  }

  // Opens the confirmation dialog for the selected attribute.
  openDeleteDialog(attribute: IAttribute): void {
    if (!this.isAdmin) {
      this.toastService.show('Access denied');
      return;
    }

    this.selectedAttribute = attribute;
    this.showDeleteDialog = true;
  }
  // Closes the dialog without deleting the attribute
  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.selectedAttribute = null;
  }
  // Deletes the attribute after the user confirms the action.
  confirmDelete(): void {
    if (!this.selectedAttribute || !this.isAdmin) {
      return;
    }

    const attribute = this.selectedAttribute;

    this.showDeleteDialog = false;
    this.selectedAttribute = null;

    this.attributeService.deleteAttribute(attribute.AttributeId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        // Record the successful delete operation
        this.activityService.addActivity(
          'Deleted',
          attribute.AttributeName,
          this.authService.currentUser?.username ?? 'Unknown'
        );

        this.toastService.show('Attribute deleted successfully');
      },
      error: error => {
        console.error('Error deleting attribute:', error);
        this.toastService.show('Unable to delete attribute');
      }
    });
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }
  // Defines the columns displayed in the reusable DataTable
  tableColumns: IDataTableColumn[] = [
    { key: 'AttributeName', label: 'Attribute Name', sortable: true, width: '20%' },
    { key: 'BusinessUnitName', label: 'Business Unit', sortable: true, width: '14%' },
    { key: 'CustomerLocationName', label: 'Customer Location', sortable: true, width: '16%' },
    { key: 'CompanyName', label: 'Company', sortable: true, width: '14%' },
    { key: 'IsActive', label: 'Status', sortable: true, width: '9%' },
    { key: 'CreatedOn', label: 'Created On', sortable: true, width: '10%' },
    { key: 'UpdatedOn', label: 'Updated On', sortable: false, width: '9%' },
    { key: 'Actions', label: 'Action', sortable: false, width: '8%' }
  ];

  // Maps Angular property names to the corresponding db.json properties
  private sortFieldMapping: Record<string, string> = {
    AttributeName: 'attribute_name',
    BusinessUnitName: 'business_unit_name',
    CustomerLocationName: 'customer_location_name',
    CompanyName: 'company_name',
    IsActive: 'is_active',
    CreatedOn: 'created_on'
  };
  // Current pagination and sorting configuration
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  // Stores only the records belonging to the current table page.
  tableRows: IAttribute[] = [];
  currentSearchTerm = '';
  sortColumn = 'AttributeName';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Indicates whether the table data is currently loading.
  isTableLoading = false;


  ngOnInit(): void {

    // Fetch all attributes to initialize the centralized store.
    this.attributeService.getAttributes().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      error: error => console.error('Error loading attributes:', error)
    });

    // Listen for search input changes.
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchVersion += 1;
        this.isSearching = true;
        this.searchError = '';
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(searchTerm => {

      // Store the latest search term.
      this.currentSearchTerm = searchTerm.trim();

      // Return to the first page when searching.
      this.currentPage = 1;

      // Load filtered and paginated records from the API.
      this.loadPagedAttributes();
    });
  }

  onSearchInput(searchTerm: string): void {
    if (searchTerm === this.searchControl.value) {
      return;
    }

    this.searchControl.setValue(searchTerm);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  // Deletes an attribute. Only Admin users are allowed to perform this action.
  deleteAttribute(attribute: IAttribute): void {

    // Extra permission check before executing the delete operation.
    if (!this.isAdmin) {
      this.toastService.show('Access denied');
      return;
    }

    // Ask for confirmation before deleting.
    const confirmed = window.confirm(
      `Are you sure you want to delete "${attribute.AttributeName}"?`
    );

    if (!confirmed) {
      return;
    }

    this.attributeService.deleteAttribute(attribute.AttributeId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.activityService.addActivity(
          'Deleted',
          attribute.AttributeName,
          this.authService.currentUser?.username ?? 'Unknown'
        );
        this.toastService.show('Attribute deleted successfully');
      },

      error: error => {
        console.error('Error deleting attribute:', error);
        this.toastService.show('Unable to delete attribute');
      }
    });
  }


  // change the presentation without reloading the data
  setView(mode: 'table' | 'card'): void {
    this.viewMode = mode;
  }

  // Loads the requested page of attributes from the API.
  loadPagedAttributes(): void {
    this.isTableLoading = true;

    const apiSortField = this.sortFieldMapping[this.sortColumn];

    this.attributeService.getAttributesPage(
      this.currentPage,
      this.pageSize,
      apiSortField,
      this.sortDirection,
      this.currentSearchTerm
    ).pipe(
      switchMap(response => response.totalRecords > 50
        ? this.attributeService.getAttributesPage(
          1,
          response.totalRecords,
          apiSortField,
          this.sortDirection,
          this.currentSearchTerm
        )
        : of(response)
      ),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isTableLoading = false;
        this.isSearching = false;
        this.changeDetector.markForCheck();
      })
    ).subscribe({
      next: response => {
        this.tableRows = response.data;
        this.totalRecords = response.totalRecords;

        this.searchError = '';
      },
      error: error => {
        console.error('Error loading paginated attributes:', error);

        if (this.currentSearchTerm) {
          this.searchError = 'Unable to search attributes please try again';
        } else {
          this.toastService.show('Unable to load attributes');
        }
      }
    });
  }

  refreshAttributes(): void {
    this.loadPagedAttributes();
  }

  // Called when the user clicks a sortable column.
  onTableSort(event: {
    column: string;
    direction: 'asc' | 'desc';
  }): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;

    // Start from the first page after changing sorting.
    this.currentPage = 1;

    this.loadPagedAttributes();
  }

  // Called when the user changes the table page.
  onTablePageChange(page: number): void {
    this.currentPage = page;
    this.loadPagedAttributes();
  }
}
