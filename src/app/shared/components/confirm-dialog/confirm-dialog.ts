import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input
  ,Output,EventEmitter
 } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
   @Input() visible = false;
  @Input() title = 'Confirm';
  @Input() description = 'Review the action before continuing.';
  @Input() confirmLabel = 'Confirm';
  @Input() danger = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();
}
