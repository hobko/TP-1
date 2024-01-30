import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  private apiUrl = environment.apiUrl
  message: string = '';
  isSystemUp: boolean = false;
  uploader: FileUploader = new FileUploader({ url: `${this.apiUrl}upload` });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}hello`).subscribe((data) => {
      this.message = data.message;
      this.isSystemUp = this.message === "System is up";
    });
  }



}


