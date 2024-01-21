import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']

})
export class HelloComponent implements OnInit {
  message: string = '';
  uploader: FileUploader = new FileUploader({ url: 'http://localhost:8000/api/upload' });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/hello').subscribe((data) => {
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