import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.scss']
})
export class AddMaterialComponent implements OnInit {
  materialName:string = "";
  description:string = "";
  materialData:any = {};

  constructor(private http:HttpService, private appConfig:AppConfigService) { }

  ngOnInit(): void {
  }

  addMaterial(data:any) {
    //console.log("::data::", data);
    if(!data.materialName || !data.description || !data.isBanned) {
      Swal.fire("Hata!", "Lütfen tüm alanları doldurun!", "error");
      return;
    }
    const url = this.appConfig.apiUrl+'/materials/';
    const todayStr = new Date().toISOString();
    //const todayStr =  [d.getFullYear(), (d.getMonth() + 1) < 10 ? '0'+ (d.getMonth() + 1) : (d.getMonth() + 1), d.getDate() < 10 ? '0' + d.getDate() : d.getDate()].join('-') + 'T' + [d.getHours() < 10 ? '0'+d.getHours() : d.getHours(),d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes(),d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds()].join(':');
    const queryParams = {
      "name":data.materialName, 
      "description":data.description,
      "isBanned": +data.isBanned,
      "createdDate":todayStr};
    this.http.post(url, queryParams).subscribe({
      next: this.addSuccess.bind(this),
      error: this.addError.bind(this)
    });
  }

  addSuccess() {
    //console.log("::KAYDETTİ::");
    Swal.fire('Başarılı','Malzeme Eklendi', 'success'); 
  }

  addError() {
    Swal.fire('Hata','Bir hata oluştu!', 'error');
  }

}
