import { Component, OnInit } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { FileService } from 'src/app/services/file.service';


@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {
  message: string = '';
  selectedFile: File | null = null; // Track the selected file
  private apiUrl = environment.apiUrl;
  uploader: FileUploader = new FileUploader({ url: `${this.apiUrl}upload` });

  constructor(private apiService: ApiService,
              private toastr: ToastrService,
              private fileService : FileService) {}

  ngOnInit() {
    this.apiService.getHello().subscribe(
      (data) => {
        this.message = data.message;
      }
    );

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    // Handle completion of each file upload
    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if (status === 200 || status === 500) {
        const jsonResponse = JSON.parse(response);
        this.toastr.success('Súbor sa nahral úspešne', 'Potvrdenie');
        this.fileService.notifyFilesUpdated();
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
  }

  // Delete the selected file
  deleteSelectedFile() {
    this.selectedFile = null;
    // Optionally, clear the file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
