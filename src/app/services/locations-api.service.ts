import { LocationResponse } from './../models/locationResponse';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationsApiService {
  baseUrl: string = 'http://35.180.182.8/';
  queryUrl: string = 'Search?';
  params: HttpParams;

  constructor(private http: HttpClient) { }    
  
  // Performs an http get request and returns the response
  public getLocationsByParameters(keyword, language, limit): Observable<LocationResponse>{
    const params = new HttpParams()
    .set('keywords', keyword)
    .set('language', language)
    .set('limit', limit)
    
    return this.http.get<LocationResponse>(this.baseUrl+this.queryUrl, { params })
    .pipe(
      // Resend request 2 times before displaying error message
      retry(2),
      catchError( (error: HttpErrorResponse) => { 
      return throwError(error);
    }));
  }
}
