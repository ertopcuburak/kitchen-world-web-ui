import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { NotifService } from './services/notif.service';

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
  unreadNotifs:any[]=[];

  constructor(private router:Router, private cdr:ChangeDetectorRef, public platform: Platform, private notifService:NotifService) { 
  }

  ngOnInit() {
    this.notifService.unreadNotifs.subscribe(change => {
      this.unreadNotifs = change;
    });
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
        this.unreadNotifs = this.notifService.getUnreadNotifs();
        this.cdr.detectChanges();
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

  logOut() {
    localStorage.clear();
    this.loggedinUser = undefined;
    this.cdr.detectChanges();
    this.router.navigateByUrl('/pages/login');
  }
}
