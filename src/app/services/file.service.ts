import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import * as toGeoJSON from 'togeojson';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl
  private apiUrlgetFiles = `${this.apiUrl}getfiles`;
  constructor(private http: HttpClient) {}

  getFiles(): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(this.apiUrlgetFiles);
  }

  getGpxFile(fileName: string): Observable<any> {
    const gpxUrl = `${this.apiUrl}getgpx/${fileName}`;


    return this.http.get(gpxUrl, { responseType: 'text' }).pipe(
      map((gpxData: string) => {
        const gpxXml = new DOMParser().parseFromString(gpxData, 'text/xml');
        return toGeoJSON.gpx(gpxXml);
      })
    );
  }
  getGpxMatchedFile(fileName: string): Observable<any> {
    const gpxUrl = `${this.apiUrl}getgpx/matched/${fileName}`;

    return this.http.get(gpxUrl, { responseType: 'text' }).pipe(
      map((gpxData: string) => {
        const gpxXml = new DOMParser().parseFromString(gpxData, 'text/xml');
        return toGeoJSON.gpx(gpxXml);
      })
    );
  }
}