import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { HttpService } from 'src/app/services/http-service.service';
import { NotifService } from 'src/app/services/notif.service';
import { Environment } from 'src/app/utils/environment';
import { Slugify } from 'src/app/utils/slugify';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  favorites:any[] = [];
  categories: any[] | undefined;
  recipes:any[] | undefined;

  lastActiveTab = "categories";
  searchText:string = "";
  loggedinUser:any;
  loading:boolean = true;
  favRecipe:any;
  showArrows:boolean = false;
  public unreadNotifs: any[] = [];
  //apiUrlConst = Environment.apiUrl;

  constructor(private http:HttpService, private router:Router, private _snackBar: MatSnackBar, public appConfig:AppConfigService, private notifService: NotifService) { 
    if(localStorage.getItem('uname') && localStorage.getItem('sid')) {
      this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('loggedinUser'))));
      this.getUnreadNotifsOfLoggedinUser();
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any): void => {
      if (event instanceof NavigationEnd) {
        this.getUnreadNotifsOfLoggedinUser();
      }

      if (event instanceof NavigationError) {
        //console.log(event.error);
      }
    });
    //console.log("::appConf.apiUrl::", this.appConfig.apiUrl);
    const screenSize = window.innerWidth;
    if(screenSize > 900) {
      this.showArrows = true;
    }
    this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('loggedinUser'))));
    this.getAllFavsOfLoggedinUser();
  }

  getUnreadNotifsOfLoggedinUser() {
    if(!this.loggedinUser)
      return;
    const todayStr = new Date().toISOString();
    const url = this.appConfig.apiUrl + '/notifications/unreads';
    const queryParams = {};
    this.http.post(url, queryParams).subscribe({
      next: this.getUnreadNotifsOfLoggedinUserSuccess.bind(this),
      error: this.getUnreadNotifsOfLoggedinUserError.bind(this)
    });
  }

  getUnreadNotifsOfLoggedinUserSuccess(data:any) {
    this.unreadNotifs = data;
    this.notifService.setUnreadNotifs(this.unreadNotifs);
  }

  getUnreadNotifsOfLoggedinUserError() {
    //this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }

  getCategories() {
    const url = this.appConfig.apiUrl + '/categories/all';
    this.http.post(url, {}).subscribe({
      next: this.getCategoriesSuccess.bind(this),
      error: this.getCategoriesError.bind(this)
    });
  }

  getCategoriesSuccess(data:any) {
    this.lastActiveTab = "categories";
    //console.log("::categories::", data);
    this.categories = data;
    this.loading = false;
  }

  getCategoriesError() {
    this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
    this.loading = false;
  }

  getRecipes(categoryId:number) {
    const sideNav = document.getElementById('drawer');
    if(sideNav!.classList.contains('mat-drawer-opened')) {
      document.getElementById('btnMenuTrigger')!.click();
    }
    this.loading = true;
    const url = this.appConfig.apiUrl + '/recipes/categorized/'+categoryId;
    this.http.post(url, {}).subscribe({
      next: this.getRecipesSuccess.bind(this),
      error: this.getRecipesError.bind(this)
    });
  }

  getRecipesSuccess(data:any) {
    this.lastActiveTab = "recipes";
    this.recipes = data;
    if(this.favorites.length > 0) {
      for(let fav of this.favorites) {
        let list = this.recipes?.filter(recipe => recipe.id === fav.recipeId);
        if(list && list.length > 0) {
          let recipe = list[0];
          recipe["isFav"] = true;
        }
      }
    }
    this.loading=false;
    document.querySelector('.mat-sidenav-content')!.scrollTop = 0;
   //console.log(document.querySelector('#btnMenuTrigger'));
  }

  getRecipesError() {
    this.recipes = [];
    this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
    this.loading=false;
  }

  goBackToCategories() {
    const sideNav = document.getElementById('drawer');
    if(sideNav!.classList.contains('mat-drawer-opened')) {
      document.getElementById('btnMenuTrigger')!.click();
    }
    this.loading = true;
    this.lastActiveTab = "categories";
    this.recipes = undefined;
    this.searchText = '';
    this.loading = false;
    document.querySelector('.mat-sidenav-content')!.scrollTop = 0;
  }

  searchRecipes(name:string) {
    if(!name || name.length < 3)
      return;
    this.loading = true;
    this.recipes = [];
    const url = this.appConfig.apiUrl + '/recipes/searchByName';
    const queryParams = {
      "searchText":name.toLowerCase()
    };
    this.http.post(url, queryParams).subscribe({
      next: this.searchRecipesSuccess.bind(this),
      error: this.searchRecipesError.bind(this)
    });
  }

  searchRecipesSuccess(data:any) {
    this.lastActiveTab = "recipes";
    this.recipes = data;
    if(this.favorites.length > 0) {
      for(let fav of this.favorites) {
        let list = this.recipes?.filter(recipe => recipe.id === fav.recipeId);
        if(list && list.length > 0) {
          let recipe = list[0];
          recipe["isFav"] = true;
        }
      }
    }
    this.loading = false;
  }

  searchRecipesError() {
    this.recipes = [];
    this.loading = false;
  }

  searchEcommerce(keyword:string, ecommerceBrand:string){
    //sr?q=SOSİS&qt=SOSİS&st=SOSİS&os=1
    //window.open(Environment.trendyolSearchUrl+keyword+'&qt='+keyword+'&st='+keyword+'&os=1', '_blank');
    keyword = Slugify.slugifyText(keyword);
    if(ecommerceBrand === 'migros') {
      window.open(Environment.migrosSearchUrl+keyword, '_blank');
    } else if(ecommerceBrand === 'trendyol') {
      window.open(Environment.trendyolSearchUrl+keyword+'&qt='+keyword+'&st='+keyword+'&os=1', '_blank');
    } else if(ecommerceBrand === 'istegelsin') {
      window.open(Environment.isteGelsinSearchUrl+keyword, '_blank');
    }
    
  }

  addToFavorites(recipe:any) {
    if(!recipe)
      return;
    this.favRecipe = recipe;
    const todayStr = new Date().toISOString();
    const url = this.appConfig.apiUrl + '/favorites/';
    const queryParams = {
      "userId":this.loggedinUser.id,
      "recipeId":recipe.id,
      "favDate":todayStr
    };
    this.http.post(url, queryParams).subscribe({
      next: this.addToFavoritesSuccess.bind(this),
      error: this.addToFavoritesError.bind(this)
    });
  }

  addToFavoritesSuccess(data:any) {
    this.favRecipe["isFav"] = true;
    this.favRecipe.favCount += 1;
    this.sendFavNotif();
    this._snackBar.open("Tarif Favorilerinize Eklendi!", "Kapat", {duration:5000});
  }

  addToFavoritesError() {
    this.favRecipe = undefined;
    this._snackBar.open("Bu tarifi daha önce favorilerinize eklediniz!", "Kapat", {duration:5000});
  }

  sendFavNotif() {
    if(!this.favRecipe || !this.loggedinUser || this.favRecipe.userId === this.loggedinUser.id)
      return;
    const triggerUser = this.loggedinUser.id;
    const triggerName = this.loggedinUser.firstName + ' ' + this.loggedinUser.lastName;
    const message = triggerName + ' "' + this.favRecipe.name + '" tarifinizi favorilere ekledi!'; 
    const todayStr = new Date().toISOString();
    const url = this.appConfig.apiUrl + '/notifications/';
    const queryParams = {
      "userId":this.favRecipe.userId,
      "type":"NEW_FAV",
      "objectId": this.favRecipe.id,
      "message": message,
      "isRead": 0,
      "triggerUser": triggerUser,
      "originSystem": 0,
      "createdTime":todayStr
    };
    this.http.post(url, queryParams).subscribe({
      next: this.sendFavNotifSuccess.bind(this),
      error: this.sendFavNotifError.bind(this)
    });
  }

  sendFavNotifSuccess(data:any) {
    console.log("::fav_notif sent!::");
    //this._snackBar.open("Tarif Favorilerinize Eklendi!", "Kapat", {duration:5000});
  }

  sendFavNotifError() {
  
  }

  getAllFavsOfLoggedinUser() {
    if(!this.loggedinUser && !this.recipes)
      return;
    const todayStr = new Date().toISOString();
    const url = this.appConfig.apiUrl + '/favorites/getFavsByUser';
    const queryParams = {
      "userId":this.loggedinUser.id,
    };
    this.http.post(url, queryParams).subscribe({
      next: this.getAllFavsOfLoggedinUserSuccess.bind(this),
      error: this.getAllFavsOfLoggedinUserError.bind(this)
    });
  }

  getAllFavsOfLoggedinUserSuccess(data:any) {
    this.favorites = data;
    this.getCategories();
  }

  getAllFavsOfLoggedinUserError() {
    //this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }

  goToAddCategory() {
    this.router.navigateByUrl('/pages/add-category');
  }

  goToAddRecipe() {
    this.router.navigateByUrl('/pages/add-recipe');
  }

}
