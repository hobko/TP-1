import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { endpoints } from 'src/environments/endpoints';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  message: string = '';
  isSystemUp: boolean = false;
  isMapmatchingUp: boolean = false;

  constructor(private http: HttpClient,
              private fileService: FileService) {}

  ngOnInit() {
    this.fileService.checkSystemStatus().subscribe(systemStatus => {
      this.isSystemUp = systemStatus;
    });

    this.fileService.checkMapMatchingStatus().subscribe(mapMatchingStatus => {
      this.isMapmatchingUp = mapMatchingStatus;
    });
  }
}


