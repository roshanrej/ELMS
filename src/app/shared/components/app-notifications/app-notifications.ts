import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppNotification } from '../../models/app-notification.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './app-notifications.html',
  styleUrl: './app-notifications.scss',
})
export class AppNotifications {
  private readonly notificationService = inject(NotificationService);

  readonly notifications = this.notificationService.notifications;

  remove(id: string): void {
    this.notificationService.remove(id);
  }

  iconFor(type: AppNotification['type']): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
    }
  }
}
