import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { Environment } from './utils/environment';
import { HttpService } from './services/http-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kitchen-world-web-ui';
  lastActiveRoute = "pages";
  loggedinUser:any;
  @ViewChild('drawer', { static: false }) public drawer!: MatDrawer;
  unreadNotifs: any[] = [];

  constructor(private router:Router, private cdr:ChangeDetectorRef, public platform: Platform, private http:HttpService) { 
    if(localStorage.getItem('uname') && localStorage.getItem('sid')) {
      this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('loggedinUser'))));
      this.getUnreadNotifsOfLoggedinUser();
      this.router.navigateByUrl('/pages/home');
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event: any): void => {
      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        if (!this.loggedinUser && localStorage.getItem('uname') && localStorage.getItem('sid')) {
          this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('loggedinUser'))));
          this.cdr.detectChanges();
          this.router.navigateByUrl('/pages/home');
        }
        if(this.drawer.opened) this.drawer.toggle();
        //console.log(event);
        document.querySelector('.mat-sidenav-content')!.scrollTop = 0;
        this.getUnreadNotifsOfLoggedinUser();
      }

      if (event instanceof NavigationError) {
        //console.log(event.error);
      }
    });
  }

  goToPage(routeName:string) {
    this.lastActiveRoute = routeName;
    this.router.navigate([routeName])
  }

  getUnreadNotifsOfLoggedinUser() {
    if(!this.loggedinUser)
      return;
    const todayStr = new Date().toISOString();
    const url = Environment.apiUrl + '/notifications/unreads';
    const queryParams = {};
    this.http.post(url, queryParams).subscribe({
      next: this.getUnreadNotifsOfLoggedinUserSuccess.bind(this),
      error: this.getUnreadNotifsOfLoggedinUserError.bind(this)
    });
  }

  getUnreadNotifsOfLoggedinUserSuccess(data:any) {
    this.unreadNotifs = data;
  }

  getUnreadNotifsOfLoggedinUserError() {
    //this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }

  logOut() {
    localStorage.clear();
    this.loggedinUser = undefined;
    this.cdr.detectChanges();
    this.router.navigateByUrl('/pages/login');
  }
}
