import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as toGeoJSON from 'togeojson';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = ' http://127.0.0.1:8000/api/getfiles';  // Replace with your FastAPI server URL

  constructor(private http: HttpClient) {}

  getFiles(): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(this.apiUrl);
  }

  getGpxFile(fileName: string): Observable<any> {
    const gpxUrl = `http://127.0.0.1:8000/api/getgpx/${fileName}`; // Replace with your GPX endpoint

    return this.http.get(gpxUrl, { responseType: 'text' }).pipe(
      map((gpxData: string) => {
        const gpxXml = new DOMParser().parseFromString(gpxData, 'text/xml');
        return toGeoJSON.gpx(gpxXml);
      })
    );
  }
  getGpxMatchedFile(fileName: string): Observable<any> {
    const gpxUrl = `http://127.0.0.1:8000/api/getgpx/matched/${fileName}`; // Replace with your GPX endpoint

    return this.http.get(gpxUrl, { responseType: 'text' }).pipe(
      map((gpxData: string) => {
        const gpxXml = new DOMParser().parseFromString(gpxData, 'text/xml');
        return toGeoJSON.gpx(gpxXml);
      })
    );
  }
}