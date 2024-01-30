import { Component, OnInit } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { endpoints } from '../../../environments/endpoints';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {
  message: string = '';
  private apiUrl = environment.apiUrl;
  uploader: FileUploader = new FileUploader({ url: `${this.apiUrl}upload` });

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

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
      }
    };
  }

  uploadFile() {
    this.uploader.uploadAll();
  }
}
