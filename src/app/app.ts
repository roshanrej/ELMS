import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth';
import { inject } from '@angular/core';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template :'<router-outlet></router-outlet>',
})
export class App {
  protected readonly title = signal('elms');
  private authService = inject(AuthService);

  ngOnInit(): void {
    void this.authService.restoreSession();
  }
}
