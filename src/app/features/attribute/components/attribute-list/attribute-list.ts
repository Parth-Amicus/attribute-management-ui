
import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AttributeService } from '../../../../core/services/attribute';
import { IAttribute } from '../../../../interface/attribute.interface';
import { AttributeCardComponent } from '../attribute-card/attribute-card';
import { ActiveStatusDirective } from '../../../../shared/directives/active-status';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time-pipe';
import { Router, RouterLink } from '@angular/router'; //lets user to navigate to different url - used in html
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AppStateStore } from '../../../../core/services/app-state-store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth';
import { ToastService } from '../../../../core/services/toast';
@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [
    RouterLink,
    AttributeCardComponent,
    ActiveStatusDirective,
    RelativeTimePipe,
    AsyncPipe
  ],
  templateUrl: './attribute-list.html', // html gets access to attributes from here
  styleUrl: './attribute-list.css'
})
export class AttributeListComponent implements OnInit {

  attributes: IAttribute[] = []; //array of type attribute interface to hold the displayed records

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
    private toastService: ToastService
  ) {
    // Components read attributes from the centralized store.
    this.attributes$ = this.store.attributes$;
  }

  ngOnInit(): void {

    // Fetch initial attributes from API and update the centralized store.
    this.attributeService.getAttributes().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      error: error => console.error('Error loading attributes:', error)
    });

    this.searchControl.valueChanges.pipe( //pipe is used to chain multiple operators together to transform the data stream
      startWith(this.searchControl.value),
      distinctUntilChanged(),
      tap(() => { // tap is rxjs operator used for performing side effects without modifying the data stream. Here, it increments the search version, sets isSearching to true, and clears any previous search error messages
        this.searchVersion += 1;
        this.isSearching = true;
        this.searchError = '';
      }),
      debounceTime(300),
      switchMap(searchTerm => { // when new term arrives it clears the previous search
        const searchVersion = this.searchVersion;
        console.log(`Searching for: ${searchTerm} (version ${searchVersion})`);
        return this.attributeService.searchAttributes(searchTerm).pipe(
          catchError(error => {
            console.error('Error searching attributes:', error);
            this.searchError = 'Unable to search attributes. Please try again.';
            this.changeDetector.markForCheck();
            return EMPTY;
          }),
          finalize(() => {
            if (searchVersion === this.searchVersion) {
              this.isSearching = false;
              this.changeDetector.markForCheck();
            }
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(attributes => {

      // Update the centralized store with the latest search results.
      this.store.setAttributes(attributes);

      // Keep the existing local property updated for compatibility.
      this.attributes = attributes;

      this.changeDetector.markForCheck();
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
}
