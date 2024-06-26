import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators'
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Slugify } from 'src/app/utils/slugify';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-my-kitchen',
  templateUrl: './my-kitchen.component.html',
  styleUrls: ['./my-kitchen.component.scss']
})
export class MyKitchenComponent implements OnInit {
  materialsData:any = {};
  recipes:any[]=[];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  matsCtrl = new FormControl('');
  materialOptions:any[] = [];
  selectedMaterials:number[]=[];
  filteredMaterials!: Observable<any[]>;
  loggedinUser:any;
  favorites:any[] = [];
  loading:boolean = true;
  favRecipe:any;
  //apiUrlConst = Environment.apiUrl;
  
  @ViewChild('materialInput')
  materialInput!: ElementRef<HTMLInputElement>;
  isSearchPressed: boolean = false;

  constructor(private http:HttpService, private _snackBar: MatSnackBar, public appConfig:AppConfigService) {
    this.filteredMaterials = this.matsCtrl.valueChanges.pipe(
      startWith(null),
      map((material: string | null) => (material ? this._filter(material) : this.materialOptions.slice())),
    );
  }

  ngOnInit(): void {
    this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('loggedinUser'))));
    this.getAllFavsOfLoggedinUser();
    this.getMaterials();
  }

  getMaterials() {
    this.loading = true;
    const url = this.appConfig.apiUrl + '/materials/all';
    this.http.post(url, {}).subscribe({
      next: this.getMaterialsSuccess.bind(this),
      error: this.getMaterialsError.bind(this)
    });
  }

  getMaterialsSuccess(data:any) {
    this.materialOptions = data;
    this.loading = false;
  }

  getMaterialsError(error:any) {
    this.loading = false;
    this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
    //console.log("::getMaterialsError - error:: ", error);
  }

  searchByMaterials(materials:any[]) {
    this.isSearchPressed = true;
    this.loading = true;
    this.recipes = [];
    if(!materials || materials.length === 0) {
      this._snackBar.open("Daha fazla malzeme girin!", "Kapat", {duration:5000});
      this.loading = false;
      return;
    }
    const url = this.appConfig.apiUrl + '/recipes/searchByMaterials';
    const queryParams = {
      "materials":materials
    };
    this.http.post(url, queryParams).subscribe({
      next: this.searchRecipesSuccess.bind(this),
      error: this.searchRecipesError.bind(this)
    });
  }

  searchRecipesSuccess(data:any) {
    this.recipes = data;
    if(this.recipes && this.recipes.length > 0 && this.favorites.length > 0) {
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
    this.loading = false;
    this._snackBar.open("Bu malzemeler ile tarif bulunamadı!", "Kapat", {duration:5000});
  }

  add(event: MatChipInputEvent): void {
   //console.log("::event.option::", event);
    if(!event || !event.value ) return;
    const value = (event.value || '').trim();
    if(!(+value)) return;
    // Add our fruit
    if (value) {
      this.selectedMaterials.push(+value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.matsCtrl.setValue(null);
  }

  remove(material: any): void {
    this.isSearchPressed = false;
   //console.log("::materialToRemove::", material);
    const index = this.selectedMaterials.indexOf(material);
    //console.log("::index::", index);
    if (index !== -1) {
      this.selectedMaterials.splice(index, 1);
    }
    //console.log("::selectedMAts::", this.selectedMaterials);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
   //console.log("::event.option::", event);
    if(!event || !event.option || !event.option.value) return;
    this.selectedMaterials.push(event.option.value);
    this.materialInput.nativeElement.value = '';
    this.matsCtrl.setValue('');
   //console.log("::selectedMAts::", this.selectedMaterials);
  }

  private _filter(value: string): any[] {
    if(value && typeof(value) === 'string') {
      value = value.toLowerCase();
    }
    const filterValue = value;

    return this.materialOptions.filter(material => material.name.toLowerCase().includes(filterValue));
  }

  showMaterialNameById(id:number) {
    if(!id) return;
    return this.materialOptions.filter(material => material.id === id)[0].name;
  }

  isSelectedMat(material:any) {
    //console.log("::isSelectedMat::", material.materialName, this.selectedMaterials.indexOf(material.materialId) !== -1);
    material['selected'] = this.selectedMaterials.indexOf(material.materialId) !== -1 ? true : false;
  }

  searchEcommerce(keyword:string, ecommerceBrand:string){
    keyword = Slugify.slugifyText(keyword);
    if(ecommerceBrand === 'migros') {
      window.open(Environment.migrosSearchUrl+keyword, '_blank');
    } else if(ecommerceBrand === 'trendyol') {
      window.open(Environment.trendyolSearchUrl+keyword+'&qt='+keyword+'&st='+keyword+'&os=1', '_blank');
    } else if(ecommerceBrand === 'istegelsin') {
      window.open(Environment.isteGelsinSearchUrl+keyword, '_blank');
    }
    
  }

  searchEcommerceSuccess(data:any) {
    //console.log("::getirData::", data);
  }

  searchEcommerceError(error:any){
    this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
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
  }

  getAllFavsOfLoggedinUserError() {
    
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
    this._snackBar.open("Tarif favorilerinize eklendi!", "Kapat", {duration:5000});
  }

  addToFavoritesError() {
    this.favRecipe = undefined;
    this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }

}
