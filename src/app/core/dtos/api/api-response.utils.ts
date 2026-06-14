import { ApiResponseDTO } from './api-response.model';

type ErrorHandler = (message: string) => void;

interface UnwrapApiResponseOptions<T> {
  fallback?: T;
  onError?: ErrorHandler;
}

function fail(message: string, onError?: ErrorHandler): never {
  onError?.(message);
  throw new Error(message);
}

export function unwrapApiResponse<T>(
  response: ApiResponseDTO<T>,
  options: UnwrapApiResponseOptions<T> = {},
): T {
  const { fallback, onError } = options;

  if (!response.success) {
    fail(response.message || 'Request failed.', onError);
  }

  if (response.data !== null) {
    return response.data;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  fail(response.message || 'Response did not include required data.', onError);
}

export function unwrapApiVoidResponse(
  response: ApiResponseDTO<null>,
  options: Pick<UnwrapApiResponseOptions<never>, 'onError'> = {},
): void {
  if (!response.success) {
    fail(response.message || 'Request failed.', options.onError);
  }
}
