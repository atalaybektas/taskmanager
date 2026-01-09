import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  /**
   * HTTP error'dan kullanıcı dostu mesaj çıkarır
   * UI yönetimi component'lerde yapılmalı (MessageService kullanarak)
   */
  handleError(error: HttpErrorResponse, defaultMessage: string): string {
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
}

