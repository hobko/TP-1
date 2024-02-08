import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { endpoints } from 'src/environments/endpoints';
import * as toGeoJSON from 'togeojson';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient,
              private notificationServie: NotificationService) {}

  private filesUpdatedSubject = new Subject<void>();
  filesUpdated$ = this.filesUpdatedSubject.asObservable();

  // Servica ktora nam zastresuje vytiahnutie Filov na FE
  getFiles(): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(endpoints.apiGetFiles);
  }
  // Sprostredkuje autoupdate po uploade
  notifyFilesUpdated(): void {
    this.filesUpdatedSubject.next();
  }

  // Servisa ktora nam vracia gpx file
  getGpxFile(fileName: string): Observable<any> {
    const gpxUrl = `${endpoints.apiGetGpx}/${fileName}`;
    return this.http.get(gpxUrl, { responseType: 'text' }).pipe(
      map((gpxData: string) => {
        const gpxXml = new DOMParser().parseFromString(gpxData, 'text/xml');
        return toGeoJSON.gpx(gpxXml);
      })
    );
  }

  downloadGpxZipFile(fileName: string): void {
    // Show an "info" message before the download starts
    this.notificationServie.showInfo('Sťahovanie súboru ' + fileName + ' začalo', 'Info');

    const zipUrl = `${endpoints.apiDownloadZipFile}/${fileName}`; // Update the endpoint
    this.http.get(zipUrl, { responseType: 'blob' }).subscribe(
      response => {
        const blob = new Blob([response], { type: 'application/zip' }); // Change the MIME type
        const url = window.URL.createObjectURL(blob);

        // Modify the filename for the downloaded zip file
        const downloadFileName = fileName.replace('.gpx', '.zip');

        const link = document.createElement('a');
        link.href = url;
        link.download = downloadFileName; // Update the filename
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        // Show a "success" message after the download is completed
        this.notificationServie.showSuccess('Súbor ' + fileName + ' bol úspešne stiahnutý', 'Úspech');
      },
      error => {
        console.error('Error downloading file:', error);
        this.notificationServie.showError('Nastala chyba pri sťahovaní súboru', 'Chyba');
      }
    );
}

// Servisa ktora nam vracia namatchovany gpx file
  getGpxMatchedFile(fileName: string): Observable<any> {
    const gpxUrl = `${endpoints.apiGetgpxMatched}/${fileName}`;

    return this.http.get(gpxUrl, { responseType: 'text' }).pipe(
      map((gpxData: string) => {
        const gpxXml = new DOMParser().parseFromString(gpxData, 'text/xml');
        return toGeoJSON.gpx(gpxXml);
      })
    );
  }

  // Serviska na check if backend je OK
  checkSystemStatus(): Observable<boolean> {
    return this.http.get<any>(`${endpoints.apiHello}`).pipe(
      map(data => data.message === "System is up")
    );
  }

   // Serviska na check if map matching je OK
   checkMapMatchingStatus(): Observable<boolean> {
    return this.http.get<any>(`${endpoints.apiGetMapMatchingStatus}`).pipe(
      map(data => data.message === "OK")
    );
  }
}