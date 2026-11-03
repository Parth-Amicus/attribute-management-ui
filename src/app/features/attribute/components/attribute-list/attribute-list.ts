
import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AttributeService } from '../../../../core/services/attribute';
import { IAttribute } from '../../../../interface/attribute.interface';
import { AttributeCardComponent } from '../attribute-card/attribute-card';
import { ActiveStatusDirective } from '../../../../shared/directives/active-status';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time-pipe';
import { RouterLink } from '@angular/router'; //lets user to navigate to different url - used in html
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [RouterLink, AttributeCardComponent, ActiveStatusDirective, RelativeTimePipe],
  templateUrl: './attribute-list.html', // html gets access to attributes from here
  styleUrl: './attribute-list.css'
})
export class AttributeListComponent implements OnInit {

  attributes: IAttribute[] = []; //array of type attribute interface to hold the displayed records

  // the table is the default view
  viewMode: 'table' | 'card' = 'table';

  searchControl = new FormControl('', { nonNullable: true });
  isSearching = true;
  searchError = '';
  private searchVersion = 0;

  constructor(
    private attributeService: AttributeService,
    private destroyRef: DestroyRef,
    private changeDetector: ChangeDetectorRef
  ) {} // provides service instance

  ngOnInit(): void {
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

  // change the presentation without reloading the data
  setView(mode: 'table' | 'card'): void {
    this.viewMode = mode;
  }
}
