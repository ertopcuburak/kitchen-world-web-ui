import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { HttpService } from './services/http-service.service';
import { MatMenuModule } from '@angular/material/menu';
import {PlatformModule} from '@angular/cdk/platform';
import {MatBadgeModule} from '@angular/material/badge';
import {HttpClientModule} from '@angular/common/http';
import { AppConfigService } from './services/app-config.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    HttpClientModule
  ],
  providers: [HttpService, 
    { 
      provide : APP_INITIALIZER, 
      multi : true, 
       deps : [AppConfigService], 
       useFactory : (appConfigService : AppConfigService) =>  () => appConfigService.loadAppConfig()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
