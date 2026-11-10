import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorLogService } from '../../../core/services/error-log';

@Component({
  selector: 'app-admin-errors',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-errors.html',
  styleUrl: './admin-errors.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminErrorsComponent {
  readonly errorLog = inject(ErrorLogService);
}
