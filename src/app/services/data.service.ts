// Example service to load the JSON data
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  // PREVERIT CI SA NAOZAJ POUZIVA MAM POCIT ZE TU JE OD ZACIATKU A UZ JU NEPOUZIVAME
  // AK MOZE IST PREC TAK ODMAZAT AJ so SPECS 
  // PREVERIT DEPENDECIE
  getData(): Observable<any[]> {
    return this.http.get<any[]>('assets/Jsons/tojson.json');
  }
}
