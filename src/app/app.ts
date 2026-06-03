import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppNotifications } from './shared/components/app-notifications/app-notifications';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppNotifications],
  template: '<app-notifications /><router-outlet />',
})
export class App {}
