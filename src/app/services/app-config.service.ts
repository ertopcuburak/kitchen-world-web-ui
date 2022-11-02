import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: any;
  private http : HttpClient;
  
  constructor(http: HttpClient) {
    this.http = http;
  }

  loadAppConfig() {
    return this.http.get('/assets/app-settings.json').subscribe(config => {
        this.appConfig = config;
    });
  }

  get apiUrl() : string {
    return this.appConfig.apiUrl;
  }
}
