import { Injectable, signal } from '@angular/core';
import { AppNotification } from '../models/app-notification.model';

type NotificationType = AppNotification['type'];

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly defaultDuration = 5000;
  private readonly notificationsSignal = signal<AppNotification[]>([]);

  readonly notifications = this.notificationsSignal.asReadonly();

  showSuccess(message: string, duration?: number): string {
    return this.show('success', message, 'Success', duration);
  }

  showError(message: string, duration?: number): string {
    return this.show('error', message, 'Error', duration);
  }

  showWarning(message: string, duration?: number): string {
    return this.show('warning', message, 'Warning', duration);
  }

  showInfo(message: string, duration?: number): string {
    return this.show('info', message, 'Info', duration);
  }

  remove(id: string): void {
    this.notificationsSignal.update(items =>
      items.filter(notification => notification.id !== id)
    );
  }

  private show(
    type: NotificationType,
    message: string,
    title?: string,
    duration = this.defaultDuration
  ): string {
    const id = crypto.randomUUID();
    const notification: AppNotification = {
      id,
      type,
      title,
      message,
      duration,
    };

    this.notificationsSignal.update(items => [...items, notification]);

    if (duration > 0) {
      window.setTimeout(() => this.remove(id), duration);
    }

    return id;
  }
}
