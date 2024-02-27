import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { endpoints } from 'src/environments/endpoints';
import { FileService } from 'src/app/services/file.service';
import { NotificationService } from 'src/app/services/notification.service';

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
              private fileService: FileService,
              private notificationService : NotificationService) {}

  ngOnInit() {
    this.fileService.checkSystemStatus().subscribe(systemStatus => {
      this.isSystemUp = systemStatus;
    });

    this.fileService.checkMapMatchingStatus().subscribe(mapMatchingStatus => {
      this.isMapmatchingUp = mapMatchingStatus;
    });
  }
  autoConvert(): void {
    this.notificationService.showInfo('Súbory sa začali spracovávať čakajte na info o spracovaní','Informácia')
    this.fileService.autoConverterFromUploads().subscribe(
      () => {
        this.notificationService.showSuccess('Konverzia úspešná všetkých súborov','Hotovo');
        this.fileService.notifyFilesUpdated();
      },
      error => {
        this.notificationService.showError('Nastala chyba','Chyba');
      }
    );
  }
}


