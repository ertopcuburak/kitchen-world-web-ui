import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
  }

  submit() {
    if (this.form.valid) {
      const url = Environment.apiUrl + '/users/login';
      const md5 = new Md5();
      const queryParams = {
        "identifier": this.form.controls['identifier'].value,
        "pwd": md5.appendStr(this.form.controls['password'].value).end()
      };
      this.http.post(url, queryParams).subscribe({
        next: this.loginSuccess.bind(this),
        error: this.loginError.bind(this)
      });
    }
  }

  loginSuccess(data:any) {
    console.log("::login OK!::", data);
    if(data) {
      sessionStorage.setItem('loggedinUser', JSON.stringify(data));
      sessionStorage.setItem('uname', data.uName);
      sessionStorage.setItem('sid', data.pwd);
    } else {
      Swal.fire('Hata','Giriş bilgileriniz hatalı!', 'error');
    }
    this.router.navigateByUrl('/home');
  }

  loginError() {
    sessionStorage.clear();
    Swal.fire('Hata','Giriş bilgileriniz hatalı!', 'error');
  }

  goToSignUp() {
    this.router.navigateByUrl('/pages/signup');
  }

}
