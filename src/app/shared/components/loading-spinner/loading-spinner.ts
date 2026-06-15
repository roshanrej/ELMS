import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinner {
  @Input() text = 'Loading...';
  @Input() size: 'sm' | 'md' = 'sm';
  // For list pages, consumer usually wraps: <section class="app-card p-3"><app-loading-spinner ... /></section>
  // Or use inline in buttons.
}
