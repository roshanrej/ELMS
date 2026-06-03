import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';

type BackendErrorBody = {
  success?: boolean;
  message?: string | null;
};

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        notifications.showError(resolveErrorMessage(error));
      }

      return throwError(() => error);
    })
  );
};

function resolveErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Unable to connect to server.';
  }

  const backendMessage = getBackendMessage(error.error);

  if (backendMessage) {
    return backendMessage;
  }

  switch (error.status) {
    case 400:
      return 'The request could not be processed.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'Requested resource was not found.';
    case 500:
      return 'An unexpected server error occurred.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

function getBackendMessage(errorBody: unknown): string | null {
  if (!errorBody || typeof errorBody !== 'object') {
    return null;
  }

  const body = errorBody as BackendErrorBody;
  return typeof body.message === 'string' && body.message.trim().length > 0
    ? body.message
    : null;
}
