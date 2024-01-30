// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { endpoints } from '../../environments/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHello(): Observable<any> {
    return this.http.get<any>(endpoints.apiHello);
  }

  makeRequest(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow all origins (adjust as needed)
    });

    return this.http.get<any>(endpoints.apiUpload, { headers });
  }
}
