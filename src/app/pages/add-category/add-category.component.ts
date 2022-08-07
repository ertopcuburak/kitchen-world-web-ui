import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Environment } from 'src/app/utils/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  categoryName:string = "";
  description:string = "";
  imageUrl:string = "";

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  addCategory() {
    const url = Environment.apiUrl+'/categories/';
    const todayStr = new Date().toISOString();
    //const todayStr =  [d.getFullYear(), (d.getMonth() + 1) < 10 ? '0'+ (d.getMonth() + 1) : (d.getMonth() + 1), d.getDate() < 10 ? '0' + d.getDate() : d.getDate()].join('-') + 'T' + [d.getHours() < 10 ? '0'+d.getHours() : d.getHours(),d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes(),d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds()].join(':');
    const queryParams = {
      "name":this.categoryName, 
      "description":this.description,
      "imageUrl":this.imageUrl,
      "createdDate":todayStr
    };
    this.http.post(url, queryParams).subscribe({
      next: this.addSuccess.bind(this),
      error: this.addError.bind(this)
    });
  }

  addSuccess() {
    console.log("::KAYDETTİ::");
    Swal.fire('Başarılı','Malzeme Eklendi', 'success'); 
  }

  addError() {
    Swal.fire('Hata','Bir hata oluştu!', 'error');
  }

}
