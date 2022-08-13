import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: any[] | undefined;
  recipes:any[] | undefined;

  lastActiveTab = "categories";

  constructor(private http:HttpService) { }

  ngOnInit(): void {
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
  }

}
