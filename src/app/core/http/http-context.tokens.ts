import { HttpContextToken } from '@angular/common/http';

/** When true, failed requests will not trigger a global error toast. */
export const SILENT_HTTP_ERROR = new HttpContextToken<boolean>(() => false);