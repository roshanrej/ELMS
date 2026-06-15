import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  imports: [CommonModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  @Input() eyebrow?: string;
  @Input({ required: true }) title: string = '';
  @Input() subtitle?: string;

  // Projected content (actions) is optional.
  // Usage: <app-page-header [title]="..." [eyebrow]="..."> <button class="btn ...">Foo</button> </app-page-header>
}