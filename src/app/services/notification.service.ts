import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessages } from './messages/error-messages';
import { SuccessMessages } from './messages/success-messages';
import { InfoMessages } from './messages/info-messages';
import { WarningMessages } from './messages/warning-messages';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccessByKey(key: keyof typeof SuccessMessages) {
    const success = SuccessMessages[key];
    this.toastr.success(success.message, success.title);
  }

  showErrorByKey(key: keyof typeof ErrorMessages) {
    const error = ErrorMessages[key];
    this.toastr.error(error.message, error.title);
  }

  showInfoByKey(key: keyof typeof InfoMessages) {
    const info = InfoMessages[key];
    this.toastr.info(info.message, info.title);
  }

  showWarningByKey(key: keyof typeof WarningMessages) {
    const warning = WarningMessages[key];
    this.toastr.warning(warning.message, warning.title);
  }

}
