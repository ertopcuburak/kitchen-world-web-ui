import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kitchen-world-web-ui';
  lastActiveRoute = "pages";

  constructor(private router:Router) { }

  goToPage(routeName:string) {
    this.lastActiveRoute = routeName;
    this.router.navigate([routeName])
  }
}
