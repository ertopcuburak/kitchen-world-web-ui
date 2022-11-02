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
    this.loadAppConfig();
  }

  loadAppConfig() {
    return this.http.get('/assets/app-settings.json').subscribe(config => {
        this.appConfig = config;
    });
  }

  get apiUrl() : string {
    if(!this.appConfig) {
      this.http.get('/assets/app-settings.json').subscribe(config => {
        this.appConfig = config;
        return this.appConfig;
      });
    } else {
      return this.appConfig.apiUrl;
    }
    return this.appConfig.apiUrl;
  }
}
