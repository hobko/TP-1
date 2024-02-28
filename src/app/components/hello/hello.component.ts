import { Component, OnInit } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { FileService } from 'src/app/services/file.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {
  message: string = '';
  selectedFile: File | null = null; // trakuje vybrany element
  selectedVehicle: string = 'car'; // default moznost je auto

  private apiUrl = environment.apiUrl;
  uploader: FileUploader = new FileUploader({ url: `${this.apiUrl}upload` });

  constructor(private apiService: ApiService,
              private toastr: ToastrService,
              private fileService : FileService,
              private notificationService : NotificationService) {}

  ngOnInit() {
    this.apiService.getHello().subscribe(
      (data) => {
        this.message = data.message;
      }
    );

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if (status === 200 || status === 500) {
        const jsonResponse = JSON.parse(response);
        this.notificationService.showSuccess('Súbor sa nahral úspešne', 'Potvrdenie');
        this.fileService.notifyFilesUpdated();
        this.deleteSelectedFile();
      }
    };
  }

  // Handle file selection
  onFileSelected(event: any) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  // Upload the selected file
  uploadFile() {
    this.uploader.uploadAll();
    this.notificationService.showInfo('Súbor sa začal náhravať, po nahratí bude zobrazená notifikácia', 'Informácia');
  }
  
  selectVehicle(vehicle: string) {
    this.selectedVehicle = vehicle; // Update the selected vehicle type
  }

  // Delete the selected file
  deleteSelectedFile() {
    this.selectedFile = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
