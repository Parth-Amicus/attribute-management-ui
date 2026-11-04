
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppStateStore } from '../../core/services/app-state-store';
import { AttributeService } from '../../core/services/attribute';
import { IAttribute } from '../../interface/attribute.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  attributes: IAttribute[] = [];

  totalAttributes = 0;
  activeAttributes = 0;
  inactiveAttributes = 0;

  constructor(
    private attributeService: AttributeService,
    private store: AppStateStore
  ) {}

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
}
