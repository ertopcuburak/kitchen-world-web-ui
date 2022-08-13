import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  constructor(private http:HttpClient) { }
  
  post(url:string, body:any):Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + window.btoa(sessionStorage.getItem('uname')+':'+sessionStorage.getItem('sid'))
      })
    };
    return this.http.post(url, body, httpOptions);
  }

  postWithoutHeaders(url:string, body:any):Observable<Object> {
    return this.http.post(url, body);
  }

  get(url:string):Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + window.btoa(sessionStorage.getItem('uname')+':'+sessionStorage.getItem('sid'))
      })
    };
    return this.http.get(url, httpOptions);
  }

}
