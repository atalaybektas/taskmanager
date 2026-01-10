import { HttpErrorResponse } from '@angular/common/http';

/**
 * HTTP error'dan kullanıcı dostu mesaj çıkarır
 */
export function getErrorMessage(error: HttpErrorResponse, defaultMessage: string): string {
  if (error.error) {
    if (typeof error.error === 'string') {
      return error.error;
    } else if (error.error.message) {
      return error.error.message;
    }
  } else if (error.message) {
    return error.message;
  }
  return defaultMessage;
}
