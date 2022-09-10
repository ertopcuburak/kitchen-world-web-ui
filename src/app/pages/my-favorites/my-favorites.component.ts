import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';
import { Slugify } from 'src/app/utils/slugify';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.scss']
})
export class MyFavoritesComponent implements OnInit {
  recipes:any[] = [];
  loggedinUser:any;
  loading:boolean = true;

  constructor(private http:HttpService, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('loggedinUser'))));
    this.getFavorites();
  }

  getFavorites() {
    this.loading = true;
    this.recipes = [];
    if(!this.loggedinUser)
      return;
    const url = Environment.apiUrl + '/recipes/getFavorites/';
    const queryParams = {
      "userId":this.loggedinUser.id
    };
    this.http.post(url, queryParams).subscribe({
      next: this.searchRecipesSuccess.bind(this),
      error: this.searchRecipesError.bind(this)
    });
  }

  searchRecipesSuccess(data:any) {
    this.recipes = data;
    this.loading = false;
  }

  searchRecipesError() {
    this.loading = false;
    this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }

  searchEcommerce(keyword:string, ecommerceBrand:string){
    keyword = Slugify.slugifyText(keyword);
    if(ecommerceBrand === 'migros') {
      window.open(Environment.migrosSearchUrl+keyword, '_blank');
    } else if(ecommerceBrand === 'trendyol') {
      window.open(Environment.trendyolSearchUrl+keyword, '_blank');
    } else if(ecommerceBrand === 'istegelsin') {
      window.open(Environment.isteGelsinSearchUrl+keyword, '_blank');
    }
    
  }

  removeFav(recipe:any) {
    if(!recipe || !this.loggedinUser) {
      return;
    }
    this.loading = true;
    this.recipes = [];
    const url = Environment.apiUrl + '/favorites/deleteFav';
    const queryParams = {
      "userId":this.loggedinUser.id,
      "recipeId":recipe.id
    };
    this.http.post(url, queryParams).subscribe({
      next: this.removeFavSuccess.bind(this),
      error: this.removeFavError.bind(this)
    });

  }

  removeFavSuccess(data:any) {
    this.recipes = data;
    this.loading = false;
    this._snackBar.open("Tarif favorilerinizden çıkarıldı!", "Kapat", {duration:5000});
    this.getFavorites();
  }

  removeFavError() {
    this.loading = false;
    this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }

}
