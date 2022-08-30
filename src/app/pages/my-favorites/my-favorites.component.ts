import { Component, OnInit } from '@angular/core';
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

  constructor(private http:HttpService) { }

  ngOnInit(): void {
    this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(sessionStorage.getItem('loggedinUser'))));
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
    Swal.fire("Hata!", "Bir hata oluştu!", "error");
  }

  searchEcommerce(keyword:string, ecommerceBrand:string){
    keyword = Slugify.slugifyText(keyword);
    if(ecommerceBrand === 'migros') {
      window.open(Environment.migrosSearchUrl+keyword, '_blank');
    } else if(ecommerceBrand === 'trendyol') {
      window.open(Environment.trendyolSearchUrl+keyword, '_blank');
    }
    
  }

}
