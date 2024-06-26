import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { HttpService } from 'src/app/services/http-service.service';
import { Environment } from 'src/app/utils/environment';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  userData: any = {};
  isAdmin = 0;
  constructor(private http: HttpService, private router:Router, private _snackBar: MatSnackBar, private appConfig:AppConfigService) { }

  ngOnInit(): void {
  }

  signUp(data: any) {
    if (this.userData.uName && this.userData.firstName && this.userData.lastName && this.userData.email && this.userData.password && this.userData.c_password && this.userData.password === this.userData.c_password) {
      //console.log("::signupData::", this.userData);
      const url = this.appConfig.apiUrl + '/users/signup';
      const todayStr = new Date().toISOString();
      const md5 = new Md5();
      //const todayStr =  [d.getFullYear(), (d.getMonth() + 1) < 10 ? '0'+ (d.getMonth() + 1) : (d.getMonth() + 1), d.getDate() < 10 ? '0' + d.getDate() : d.getDate()].join('-') + 'T' + [d.getHours() < 10 ? '0'+d.getHours() : d.getHours(),d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes(),d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds()].join(':');
      const queryParams = {
        "uName": this.userData.uName,
        "email": this.userData.email,
        "pwd": md5.appendStr(this.userData.password).end(),
        "type": this.isAdmin,
        "firstName": this.userData.firstName,
        "lastName": this.userData.lastName,
        "createdDate": todayStr
      };
      this.http.postWithoutHeaders(url, queryParams).subscribe({
        next: this.addSuccess.bind(this),
        error: this.addError.bind(this)
      });
    } else {
      this._snackBar.open("Eksik/hatalı bilgi girdiniz, lütfen kontrol edip tekrar deneyiniz.", "Kapat", {duration:5000});
    }
  }

  addSuccess() {
    //console.log("::KAYDETTİ::");
    this._snackBar.open("Başarıyla üye oldunuz, artık giriş yapabilirsiniz!", "Kapat", {duration:5000});
    this.router.navigateByUrl('/pages/login');
  }

  addError() {
    this._snackBar.open("Bir hata oluştu!", "Kapat", {duration:5000});
  }

}
