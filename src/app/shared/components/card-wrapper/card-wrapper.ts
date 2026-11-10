import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-wrapper',
  standalone: true,
  templateUrl: './card-wrapper.html',
  styleUrl: './card-wrapper.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardWrapperComponent {}