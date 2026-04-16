import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template :'<router-outlet></router-outlet>',
})
export class App {
  protected readonly title = signal('elms');
}
