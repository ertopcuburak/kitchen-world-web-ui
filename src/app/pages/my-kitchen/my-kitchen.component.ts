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
  
  @ViewChild('materialInput')
  materialInput!: ElementRef<HTMLInputElement>;

  constructor(private http:HttpService) {
    this.filteredMaterials = this.matsCtrl.valueChanges.pipe(
      startWith(null),
      map((material: string | null) => (material ? this._filter(material) : this.materialOptions.slice())),
    );
  }

  ngOnInit(): void {
    this.loggedinUser = JSON.parse(JSON.parse(JSON.stringify(sessionStorage.getItem('loggedinUser'))));
    this.getAllFavsOfLoggedinUser();
    this.getMaterials();
  }

  getMaterials() {
    this.loading = true;
    const url = Environment.apiUrl + '/materials/all';
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
    Swal.fire("Hata!", "Bir hata oluştu!", "error");
    //console.log("::getMaterialsError - error:: ", error);
  }

  searchByMaterials(materials:any[]) {
    this.loading = true;
    this.recipes = [];
    if(!materials || materials.length === 0)
      return;
    const url = Environment.apiUrl + '/recipes/searchByMaterials';
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
    Swal.fire("Hata!", "Bu malzemeler ile tarif bulunamadı!", "error");
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.selectedMaterials.push(+value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.matsCtrl.setValue(null);
  }

  remove(material: any): void {
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
      window.open(Environment.trendyolSearchUrl+keyword, '_blank');
    } else if(ecommerceBrand === 'istegelsin') {
      window.open(Environment.isteGelsinSearchUrl+keyword, '_blank');
    }
    
  }

  searchEcommerceSuccess(data:any) {
    //console.log("::getirData::", data);
  }

  searchEcommerceError(error:any){
    Swal.fire("Hata!",error,"error");
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
  }

  getAllFavsOfLoggedinUserError() {
    
  }

}
