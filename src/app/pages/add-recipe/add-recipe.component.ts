import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit {
  recipeData:any = {};
  recipeName:string = "";
  description:string = "";
  imageUrl:string = "";
  howToMake:string = "";

  materialList:any[] = [];
  materialOptions:any[] = [];

  selectedMaterials:any[] = [];

  categoryOptions:any[] = [];
  selectedCategory:any;
  categoryId!:number;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '0',
    maxHeight: '1000',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Yapılışı...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'assets/image',
  };

  constructor(private http:HttpService) { }

  ngOnInit(): void {
    this.getCategories();
    this.getMaterials();
  }

  getCategories() {
    const url = Environment.apiUrl + '/categories/all';
    this.http.post(url, {}).subscribe({
      next: this.getCategoriesSuccess.bind(this),
      error: this.getCategoriesError.bind(this)
    });
  }

  getMaterials() {
    const url = Environment.apiUrl + '/materials/all';
    this.http.post(url, {}).subscribe({
      next: this.getMaterialsSuccess.bind(this),
      error: this.getMaterialsError.bind(this)
    });
  }

  getCategoriesSuccess(data:any) {
    this.categoryOptions = data;
    //this.selectedMaterials.push(this.materialOptions[0]);
  }

  getCategoriesError(error:any) {
    //console.log("::getCategoriesError - error:: ", error);
  }

  getMaterialsSuccess(data:any) {
    this.materialOptions = data;
    //this.selectedMaterials.push(this.materialOptions[0]);
  }

  getMaterialsError(error:any) {
    //console.log("::getMaterialsError - error:: ", error);
  }

  categorySelected() {
    this.categoryId = this.selectedCategory.id;
    //console.log("::selectedCategory::", this.selectedCategory, "::categoryId::", this.categoryId);
  }

  materialSelected(id:number) {
    const material = {
      "materialId": this.selectedMaterials[id] ? this.selectedMaterials[id].id : null,
      "quantity": this.materialList[id] && this.materialList[id]['quantity'] ? this.materialList[id]['quantity'] : ""
    }
    this.materialList[id] = material;
    //this.materialList[id] && this.materialList[id]['quantity'] ? this.materialList[id]['quantity'] : "";
    //console.log("::materialList::", this.materialList);
  }

  removeSelecteMaterial(id:number) {
    this.selectedMaterials.splice(id, 1);
    this.materialList.splice(id, 1);
  }

  setMaterialQuantity(index:number, event:any) {
    this.materialList[index]['quantity'] = event.target.value;
    //console.log("::materialList::", this.materialList);
  }

  filterMaterial(value:any) {
    const name = typeof value === 'string' ? value : value?.name;
    return name ? this._filter(name as string) : this.materialOptions.slice();
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    let filtered = this.materialOptions.filter(option => option.name.toLowerCase().includes(filterValue));
    //console.log("::filtered::", filtered);
    return filtered;
  }

  addToMaterialList() {
    this.materialList.push({});
  }

  saveRecipe(data:any) {
    const url = Environment.apiUrl+'/recipes/';
    const todayStr = new Date().toISOString();
    //const todayStr =  [d.getFullYear(), (d.getMonth() + 1) < 10 ? '0'+ (d.getMonth() + 1) : (d.getMonth() + 1), d.getDate() < 10 ? '0' + d.getDate() : d.getDate()].join('-') + 'T' + [d.getHours() < 10 ? '0'+d.getHours() : d.getHours(),d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes(),d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds()].join(':');
    const loggedinUser:any = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('loggedinUser'))));
    ////console.log("::loggedinUser::", loggedinUser);
    const userId:number | undefined = loggedinUser ? loggedinUser.id : undefined;
    ////console.log("::userId::", userId);
    if(!data.name || !data.desc || !this.howToMake || !userId || !this.materialList || !this.categoryId || !data.imgUrl) {
      Swal.fire("Hata!", "Lütfen tüm alanları doldurun!", "error");
      return;
    }
    const queryParams = {
      "name":data.name, 
      "description":data.desc,
      "howToMake":this.howToMake,
      "userId":userId,
      "materialList":this.materialList,
      "categoryId":this.categoryId,
      "imageUrl":data.imgUrl,
      "createdDate":todayStr,
      "updatedDate":null
    };
    this.http.post(url, queryParams).subscribe({
      next: this.addSuccess.bind(this),
      error: this.addError.bind(this)
    });
  }

  addSuccess() {
    //console.log("::KAYDETTİ::");
    Swal.fire('Başarılı','Tarif Eklendi', 'success'); 
  }

  addError() {
    Swal.fire('Hata', 'Bir hata oluştu!', 'error');
  }

}
