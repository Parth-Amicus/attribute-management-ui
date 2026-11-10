import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';

export interface IDataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {

  // Column definitions supplied by the parent component.
  @Input() columns: IDataTableColumn[] = [];

  // Current page of records returned by the API.
  @Input() rows: any[] = [];

  // Custom template supplied by the parent for displaying each row.
  @Input() rowTemplate?: TemplateRef<any>;

  // Current pagination information.
  @Input() currentPage = 1;
  @Input() pageSize = 5;
  @Input() totalRecords = 0;

  // Current sorting information.
  @Input() sortColumn = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  // Notify the parent when sorting changes.
  @Output() sortChange = new EventEmitter<{
    column: string;
    direction: 'asc' | 'desc';
  }>();

  // Notify the parent when the page changes.
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  get isVirtualScrollEnabled(): boolean {
    return this.rows.length > 50;
  }

  trackRow(_index: number, row: { AttributeId: number | string }): number | string {
    return row.AttributeId;
  }

  onSort(column: IDataTableColumn): void {
    if (!column.sortable) {
      return;
    }

    const direction =
      this.sortColumn === column.key && this.sortDirection === 'asc'
        ? 'desc'
        : 'asc';

    this.sortChange.emit({
      column: column.key,
      direction
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.pageChange.emit(page);
  }
}