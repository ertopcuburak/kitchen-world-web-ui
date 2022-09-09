import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private http:HttpClient, private router:Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  submit(data:any) {
    if (data && data.identifier && data.password) {
      const url = Environment.apiUrl + '/users/login';
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
      sessionStorage.setItem('loggedinUser', JSON.stringify(data));
      sessionStorage.setItem('uname', data.uName);
      sessionStorage.setItem('sid', this.sid!);
    } else {
      this._snackBar.open("Giriş bilgileriniz hatalı!", "Kapat", {duration:5000});
    }
    this.router.navigateByUrl('/home');
  }

  loginError() {
    sessionStorage.clear();
    this._snackBar.open("Giriş bilgileriniz hatalı!", "Kapat", {duration:5000});
  }

  goToSignUp() {
    this.router.navigateByUrl('/pages/signup');
  }

}
