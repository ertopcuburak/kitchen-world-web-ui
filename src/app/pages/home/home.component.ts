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
  categories: any[] | undefined;
  recipes:any[] | undefined;

  lastActiveTab = "categories";
  searchText:string = "";
  loggedinUser:any;

  constructor(private http:HttpService) { }

  ngOnInit(): void {
    this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(sessionStorage.getItem('loggedinUser'))));
    this.getCategories();
  }

  getCategories() {
    const url = Environment.apiUrl + '/categories';
    this.http.get(url).subscribe({
      next: this.getCategoriesSuccess.bind(this),
      error: this.getCategoriesError.bind(this)
    });
  }

  getCategoriesSuccess(data:any) {
    this.lastActiveTab = "categories";
    console.log("::categories::", data);
    this.categories = data;
  }

  getCategoriesError() {

  }

  getRecipes(categoryId:number) {
    const url = Environment.apiUrl + '/recipes/categorized/'+categoryId;
    this.http.get(url).subscribe({
      next: this.getRecipesSuccess.bind(this),
      error: this.getRecipesError.bind(this)
    });
  }

  getRecipesSuccess(data:any) {
    this.lastActiveTab = "recipes";
    this.recipes = data;
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
      "searchText":name
    };
    this.http.post(url, queryParams).subscribe({
      next: this.searchRecipesSuccess.bind(this),
      error: this.searchRecipesError.bind(this)
    });
  }

  searchRecipesSuccess(data:any) {
    this.lastActiveTab = "recipes";
    this.recipes = data;
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

  addToFavorites(recipeId:number) {
    if(!recipeId)
      return;
    const todayStr = new Date().toISOString();
    const url = Environment.apiUrl + '/favorites/';
    const queryParams = {
      "userId":this.loggedinUser.id,
      "recipeId":recipeId,
      "favDate":todayStr
    };
    this.http.post(url, queryParams).subscribe({
      next: this.addToFavoritesSuccess.bind(this),
      error: this.addToFavoritesError.bind(this)
    });
  }

  addToFavoritesSuccess(data:any) {
    Swal.fire("OK", "Tarif favorilerinize eklendi!", "success");
  }

  addToFavoritesError() {
    Swal.fire("Hata!", "Bu tarifi daha önce favorilerinize eklediniz!", "error");
  }

}
