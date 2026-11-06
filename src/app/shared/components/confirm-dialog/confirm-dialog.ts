
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialogComponent {

  // Controls whether the dialog is visible.
  @Input() isOpen = false;

  // Title displayed at the top of the dialog.
  @Input() title = 'Confirm Action';

  // Message displayed inside the dialog.
  @Input() message = 'Are you sure you want to continue?';

  // Notifies the parent when the user confirms.
  @Output() confirmed = new EventEmitter<void>();

  // Notifies the parent when the user cancels.
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
