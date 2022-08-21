import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators'
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
  
  @ViewChild('materialInput')
  materialInput!: ElementRef<HTMLInputElement>;

  constructor(private http:HttpService) {
    this.filteredMaterials = this.matsCtrl.valueChanges.pipe(
      startWith(null),
      map((material: string | null) => (material ? this._filter(material) : this.materialOptions.slice())),
    );
  }

  ngOnInit(): void {
    this.getMaterials();
  }

  getMaterials() {
    const url = Environment.apiUrl + '/materials';
    this.http.get(url).subscribe({
      next: this.getMaterialsSuccess.bind(this),
      error: this.getMaterialsError.bind(this)
    });
  }

  getMaterialsSuccess(data:any) {
    this.materialOptions = data;
  }

  getMaterialsError(error:any) {
    console.log("::getMaterialsError - error:: ", error);
  }

  searchByMaterials(materials:any[]) {
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
  }

  searchRecipesError() {

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
    console.log("::materialToRemove::", material);
    const index = this.selectedMaterials.indexOf(material);
    console.log("::index::", index);
    if (index !== -1) {
      this.selectedMaterials.splice(index, 1);
    }
    console.log("::selectedMAts::", this.selectedMaterials);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("::event.option::", event);
    this.selectedMaterials.push(event.option.value);
    this.materialInput.nativeElement.value = '';
    this.matsCtrl.setValue('');
    console.log("::selectedMAts::", this.selectedMaterials);
  }

  private _filter(value: string): any[] {
    const filterValue = value;

    return this.materialOptions.filter(material => material.name.toLowerCase().includes(filterValue));
  }

  showMaterialNameById(id:number) {
    return this.materialOptions.filter(material => material.id === id)[0].name;
  }

  isSelectedMat(material:any) {
    console.log("::isSelectedMat::", material.materialName, this.selectedMaterials.indexOf(material.materialId) !== -1);
    material['selected'] = this.selectedMaterials.indexOf(material.materialId) !== -1 ? true : false;
  }

}
