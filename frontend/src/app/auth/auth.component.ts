import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { ApiService } from '../api.service';

interface TokenObj {
  token: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  authForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  registerMode = false;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const token = this.cookieService.get('movies-rater-token');
    if (token) { this.router.navigate(['/movies']); }
  }

  saveForm() {
    if (!this.registerMode) {
      this.loginUser();
    } else {
      this.apiService.registerUser(this.authForm.value).subscribe(
        data => {
          this.loginUser();
        },
        error => console.log(error)
      );
    }
  }

  loginUser() {
    this.apiService.loginUser(this.authForm.value).subscribe(
      (data: TokenObj) => {
        this.cookieService.set( 'movies-rater-token', data.token );
        this.router.navigate(['/movies']);
      },
      error => console.log(error)
    );
  }

}
