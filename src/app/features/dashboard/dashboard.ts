
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { AppStateStore } from '../../core/services/app-state-store';
import { AttributeService } from '../../core/services/attribute';
import { IAttribute } from '../../interface/attribute.interface';
import { ActivityService, IActivity } from '../../core/services/activity';
import { AsyncPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  attributes: IAttribute[] = [];

  totalAttributes = 0;
  activeAttributes = 0;
  inactiveAttributes = 0;
  private activityService = inject(ActivityService);
  activities$ = this.activityService.activities$;
  constructor(
    private attributeService: AttributeService,
    private store: AppStateStore,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.attributeService.getAttributes().subscribe({
      next: attributes => {
        this.attributes = attributes;
        this.calculateSummary();
        this.changeDetector.markForCheck();
      },
      error: error => {
        console.error('Unable to load dashboard data:', error);
      }
    });
  }

  private calculateSummary(): void {
    this.totalAttributes = this.attributes.length;

    this.activeAttributes = this.attributes.filter(
      attribute => attribute.IsActive
    ).length;

    this.inactiveAttributes = this.attributes.filter(
      attribute => !attribute.IsActive
    ).length;
  }

    
// SVG chart dimensions.
readonly chartWidth = 700;
readonly chartHeight = 300;
readonly chartTop = 20;
readonly chartBottom = 240;
readonly chartLeft = 55;
readonly chartRight = 20;

// Calculates the maximum value used on the Y-axis.
get chartMaxCount(): number {
  const maxCount = Math.max(
    0,
    ...this.businessUnitCounts.map(item => item.count)
  );

  // Round up to a convenient scale.
  return Math.max(5, Math.ceil(maxCount / 5) * 5);
}

private get businessUnitCounts(): { businessUnitName: string; count: number }[] {
  const counts = new Map<string, number>();

  this.attributes.forEach(attribute => {
    const businessUnit = attribute.BusinessUnitName || 'Unknown';

    counts.set(
      businessUnit,
      (counts.get(businessUnit) ?? 0) + 1
    );
  });

  return Array.from(counts, ([businessUnitName, count]) => ({
    businessUnitName,
    count
  }));
}

// Groups attributes by Business Unit and calculates bar positions.
get businessUnitChartData() {
  const entries = this.businessUnitCounts;
  const plotWidth = this.chartWidth - this.chartLeft - this.chartRight;
  const slotWidth = entries.length > 0
    ? plotWidth / entries.length
    : plotWidth;

  const barWidth = Math.min(55, slotWidth * 0.6);
  const plotHeight = this.chartBottom - this.chartTop;

  return entries.map((item, index) => {
    const barHeight = (item.count / this.chartMaxCount) * plotHeight;

    return {
      ...item,
      x: this.chartLeft + (index * slotWidth) + (slotWidth - barWidth) / 2,
      y: this.chartBottom - barHeight,
      width: barWidth,
      height: barHeight,
      labelX: this.chartLeft + (index * slotWidth) + slotWidth / 2
    };
  });
}

// Generates six equally spaced Y-axis values.
get chartYAxisTicks(): number[] {
  return Array.from({ length: 6 }, (_, index) =>
    (this.chartMaxCount / 5) * index
  );
}



}
