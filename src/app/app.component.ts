import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

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

  constructor(private router:Router, private cdr:ChangeDetectorRef, private activatedRoute:ActivatedRoute) { 
    if(sessionStorage.getItem('uname') && sessionStorage.getItem('sid')) {
      this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(sessionStorage.getItem('loggedinUser'))));
      this.router.navigateByUrl('/home');
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event: any): void => {
      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        if (!this.loggedinUser && sessionStorage.getItem('uname') && sessionStorage.getItem('sid')) {
          this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(sessionStorage.getItem('loggedinUser'))));
          this.cdr.detectChanges();
          this.router.navigateByUrl('/home');
        }
        if(this.drawer.opened) this.drawer.toggle();
        //console.log(event);
        document.querySelector('.mat-sidenav-content')!.scrollTop = 0;
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
    sessionStorage.clear();
    this.loggedinUser = undefined;
    this.cdr.detectChanges();
    this.router.navigateByUrl('/pages/login');
  }
}
