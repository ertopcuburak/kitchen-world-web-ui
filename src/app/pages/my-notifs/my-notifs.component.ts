import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';

@Component({
  selector: 'app-my-notifs',
  templateUrl: './my-notifs.component.html',
  styleUrls: ['./my-notifs.component.scss']
})
export class MyNotifsComponent implements OnInit {
  loading:boolean = false;
  loggedinUser:any;
  allNotifs: any[] = [];

  constructor(private http:HttpService, private router:Router, private appConfig:AppConfigService) { }

  ngOnInit(): void {
    this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('loggedinUser'))));
    this.getAllNotifsOfLoggedinUser();
  }

  getAllNotifsOfLoggedinUser() {
    if(!this.loggedinUser)
      return;
    this.loading = true;
    const todayStr = new Date().toISOString();
    const url = this.appConfig.apiUrl + '/notifications/all';
    const queryParams = {};
    this.http.post(url, queryParams).subscribe({
      next: this.getAllNotifsOfLoggedinUserSuccess.bind(this),
      error: this.getAllNotifsOfLoggedinUserError.bind(this)
    });
  }

  getAllNotifsOfLoggedinUserSuccess(data:any) {
    this.allNotifs = data;
    this.loading = false;
  }

  getAllNotifsOfLoggedinUserError() {
    //this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }
  
  readNotif(id:number) {
    if(!this.loggedinUser)
      return;
    this.loading = true;
    const todayStr = new Date().toISOString();
    const url = this.appConfig.apiUrl + '/notifications/read/'+id;
    const queryParams = {};
    this.http.post(url, queryParams).subscribe({
      next: this.readNotifSuccess.bind(this),
      error: this.readNotifError.bind(this)
    });
  }

  readNotifSuccess(data:any) {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    })
    //this.router.navigateByUrl('/pages/my-notifs');
  }

  readNotifError() {
    //this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }

}
