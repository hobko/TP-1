import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']

})
export class HelloComponent implements OnInit {
  private apiUrl = environment.apiUrl
  message: string = '';
  uploader: FileUploader = new FileUploader({ url: `${this.apiUrl}upload` });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}hello`).subscribe((data) => {
      this.message = data.message;
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }

  uploadFile() {
    this.uploader.uploadAll();
  }
}