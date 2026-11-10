import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-collapsible-section',
  standalone: true,
  templateUrl: './collapsible-section.html',
  styleUrl: './collapsible-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollapsibleSectionComponent {

  // Controls whether the section body is visible
  isExpanded = signal(true);

  // Toggles the section between expanded and collapsed
  toggleSection(): void {
    this.isExpanded.update(value => !value);
  }
}