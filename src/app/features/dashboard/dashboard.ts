
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AppStateStore } from '../../core/services/app-state-store';
import { AttributeService } from '../../core/services/attribute';
import { IAttribute } from '../../interface/attribute.interface';
import { DecimalPipe } from '@angular/common';
import { ActivityService, IActivity } from '../../core/services/activity';
import { AsyncPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, DatePipe],
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
  ) { }

  ngOnInit(): void {
    this.attributeService.getAttributes().subscribe({
      next: attributes => {
        this.attributes = attributes;
        this.calculateSummary();
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

  // Calculates the percentage of active attributes.
  get activePercentage(): number {
    if (this.totalAttributes === 0) return 0;

    return (this.activeAttributes / this.totalAttributes) * 100;
  }

  // Calculates the percentage of inactive attributes.
  get inactivePercentage(): number {
    if (this.totalAttributes === 0) return 0;

    return (this.inactiveAttributes / this.totalAttributes) * 100;
  }

  // SVG circle circumference for radius 45.
  readonly circleCircumference = 2 * Math.PI * 45;

  // Calculates the active portion of the SVG circle.
  get activeStrokeLength(): number {
    return (this.activePercentage / 100) * this.circleCircumference;
  }


}
