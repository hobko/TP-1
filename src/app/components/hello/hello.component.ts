import { Component, OnInit } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { FileService } from 'src/app/services/file.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.html',
  styleUrls: ['./hello.css']
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

  }

  onFileSelected(event: any) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
    // Create FormData object to append file and vehicle type
    const formData = new FormData();
    formData.append('file', this.selectedFile as Blob); // Append selected file
    formData.append('vehicle_type', this.selectedVehicle); // Append selected vehicle type
  
    // Make API call to upload file with vehicle type
    this.fileService.uploadFile(formData).subscribe(
      (response) => {
        console.log(response);
        this.notificationService.showSuccess('Súbor sa nahral úspešne', 'Potvrdenie');
        this.fileService.notifyFilesUpdated();
        this.deleteSelectedFile();
      },
      (error) => {
        console.error(error);
        this.notificationService.showError('Chyba pri nahrávaní súboru', 'Chyba');
      }
    );
  }
  
  selectVehicle(vehicle: string) {
    this.selectedVehicle = vehicle;
  }

  deleteSelectedFile() {
    this.selectedFile = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
