import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { endpoints } from 'src/environments/endpoints';
import * as toGeoJSON from 'togeojson';
import { NotificationService } from './notification.service';
import { ErrorMessages } from '../messages/error-messages';
import { SuccessMessages } from '../messages/success-messages';
import { InfoMessages } from '../messages/info-messages';
import { WarningMessages } from '../messages/warning-messages';

export interface FileResponse {
  files: string[];
  filename : string;
  vehicle_type: string;
  inserted_date: string; 
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient,
              private notificationService: NotificationService) {}

  private filesUpdatedSubject = new Subject<void>();
  filesUpdated$ = this.filesUpdatedSubject.asObservable();


  uploadFile(formData: FormData): Observable<any> {
    this.notificationService.showInfoByKey('fileUploadStartedNotification');
    return this.http.post<any>(endpoints.apiUpload, formData);
  }

  // Servica ktora nam zastresuje vytiahnutie Filov na FE
  getFiles(): Observable<FileResponse> {
    return this.http.get<FileResponse>(endpoints.apiGetFiles);
  }

  deleteFilesFromUploads(selectedFiles: string[]): Observable<any> {
    return this.http.delete<any>(`${endpoints.apiDeleteUploads}`, { body: selectedFiles });
  }

  convertFilesFromUploads(selectedFiles: string[]): Observable<any> {
    this.notificationService.showInfoByKey('filesConversionStartedNotification');
    return this.http.post<any>(`${endpoints.apiConvertUploads}`, selectedFiles);
  }
  getUploadsFiles(): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(endpoints.apiGetUploadsFiles);
  }

  // Sprostredkuje autoupdate po uploade vztahuje sa len na pridavanie
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
    this.notificationService.showInfoByKey('fileDownloadStartedNotification');

    const zipUrl = `${endpoints.apiDownloadZipFile}/${fileName}`; // Update the endpoint
    this.http.get(zipUrl, { responseType: 'blob' }).subscribe(
      response => {
        const blob = new Blob([response], { type: 'application/zip' }); // Ensure correct MIME type
        const url = window.URL.createObjectURL(blob);

        // Modify the filename for the downloaded zip file
        const downloadFileName = fileName.replace(/\.[^.]+$/, '') + '.zip'; // Replace any extension with .zip

        const link = document.createElement('a');
        link.href = url;
        link.download = downloadFileName; // Update the filename
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        // Show a "success" message after the download is completed
        this.notificationService.showSuccessByKey('fileDownloadedSuccess');
      },
      error => {
        console.error('Error downloading file:', error);
        this.notificationService.showErrorByKey('errorWhileDownloadingFile');
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

  // Serviska ktora maze vsetky fily z dockera
  deleteDataFromStorage(fileName: string): void {
    this.http.delete(`${endpoints.apiDeleteFile}/${fileName}`).subscribe(
      (response) => {
        console.log(response);
        this.notificationService.showSuccessByKey('fileDeletedSuccess')
      },
      (error) => {
        console.error(error);
        this.notificationService.showErrorByKey('errorWhileErasingFile')
      }
    );
  }

  autoConverterFromUploads(): Observable<any> {
    const autoConvertUrl = `${endpoints.apiAutoConvert}`;
    return this.http.get(autoConvertUrl);
  }


}
