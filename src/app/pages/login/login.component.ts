import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { Environment } from 'src/app/utils/environment';
import Swal from 'sweetalert2';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    identifier: new FormControl(''),
    password: new FormControl(''),
  });

  error:any;
  userData:any = {};
  sid:string|undefined;

  constructor(private http:HttpClient, private router:Router, private _snackBar: MatSnackBar, private appConfig:AppConfigService) { }

  ngOnInit(): void {
  }

  submit(data:any) {
    if (data && data.identifier && data.password) {
      const url = this.appConfig.apiUrl + '/users/login';
      const md5 = new Md5();
      this.sid = md5.appendStr(data.password).end().toString();
      const queryParams = {
        "identifier": data.identifier,
        "pwd": this.sid
      };
      this.http.post(url, queryParams).subscribe({
        next: this.loginSuccess.bind(this),
        error: this.loginError.bind(this)
      });
    }
  }

  loginSuccess(data:any) {
    //console.log("::login OK!::", data);
    if(data) {
      localStorage.setItem('loggedinUser', JSON.stringify(data));
      localStorage.setItem('uname', data.uName);
      localStorage.setItem('sid', this.sid!);
    } else {
      this._snackBar.open("Giriş bilgileriniz hatalı!", "Kapat", {duration:5000});
    }
    this.router.navigateByUrl('/pages/auth-check');
  }

  loginError() {
    localStorage.clear();
    this._snackBar.open("Giriş bilgileriniz hatalı!", "Kapat", {duration:5000});
  }

  goToSignUp() {
    this.router.navigateByUrl('/pages/signup');
  }

}
