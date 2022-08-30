import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';
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

  constructor(private http:HttpService) { }

  ngOnInit(): void {
    this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(sessionStorage.getItem('loggedinUser'))));
    this.getAllFavsOfLoggedinUser();
  }

  getCategories() {
    const url = Environment.apiUrl + '/categories/all';
    this.http.post(url, {}).subscribe({
      next: this.getCategoriesSuccess.bind(this),
      error: this.getCategoriesError.bind(this)
    });
  }

  getCategoriesSuccess(data:any) {
    this.lastActiveTab = "categories";
    //console.log("::categories::", data);
    this.categories = data;
  }

  getCategoriesError() {

  }

  getRecipes(categoryId:number) {
    const url = Environment.apiUrl + '/recipes/categorized/'+categoryId;
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
  }

  getRecipesError() {

  }

  goBackToCategories() {
    this.lastActiveTab = "categories";
    this.recipes = undefined;
    this.searchText = '';
  }

  searchRecipes(name:string) {
    if(!name || name.length < 3)
      return;
    const url = Environment.apiUrl + '/recipes/searchByName';
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
  }

  searchRecipesError() {

  }

  searchEcommerce(keyword:string, ecommerceBrand:string){
    if(ecommerceBrand === 'migros') {
      window.open(Environment.migrosSearchUrl+keyword, '_blank');
    } else if(ecommerceBrand === 'trendyol') {
      window.open(Environment.trendyolSearchUrl+keyword, '_blank');
    }
    
  }

  addToFavorites(recipe:any) {
    if(!recipe)
      return;
    this.favRecipe = recipe;
    const todayStr = new Date().toISOString();
    const url = Environment.apiUrl + '/favorites/';
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
    Swal.fire("OK", "Tarif favorilerinize eklendi!", "success");
  }

  addToFavoritesError() {
    this.favRecipe = undefined;
    Swal.fire("Hata!", "Bu tarifi daha önce favorilerinize eklediniz!", "error");
  }

  getAllFavsOfLoggedinUser() {
    if(!this.loggedinUser && !this.recipes)
      return;
    const todayStr = new Date().toISOString();
    const url = Environment.apiUrl + '/favorites/getFavsByUser';
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
    this.loading = false;
    this.getCategories();
  }

  getAllFavsOfLoggedinUserError() {
    //Swal.fire("Hata!", "Bu tarifi daha önce favorilerinize eklediniz!", "error");
  }

}
