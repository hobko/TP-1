import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }
   
  // zelena
  showSuccess(message: string,
              title : string){
      this.toastr.success(message, title)
  }
   
  // Cervena
  showError(message: string,
            title : string){
      this.toastr.error(message, title)
  }
   
  // Modra mozem sa mylit
  showInfo(message: string,
           title : string){
      this.toastr.info(message, title)
  }
   
  // Oranzova mozem sa mylit
  showWarning(message: string,
              title : string){
      this.toastr.warning(message, title)
  }
   
}
