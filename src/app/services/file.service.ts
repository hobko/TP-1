import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { endpoints } from 'src/environments/endpoints';
import * as toGeoJSON from 'togeojson';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) {}

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