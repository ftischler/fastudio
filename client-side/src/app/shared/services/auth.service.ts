import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment';

// const BASE_URL = 'http://localhost:3000/v1';
const BASE_URL = `${environment.BASE_URL}/v1`;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  access_token: any;
  auth_token: any;

  constructor(
    @Inject(PLATFORM_ID) private platfrom: Object,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private router: Router) { }

  createUser(body: User): Observable<any> {
    return this.httpClient.post<User>(`${BASE_URL}/registerUser`, body);
  }

  verifyUser(email: string, body: any): Observable<any> {
    return this.httpClient.post<any>(
      `${BASE_URL}/verifyMe/user/${email}`,
      body
    );
  }

  loginUser(body: User): Observable<any> {
    return this.httpClient.post<User>(`${BASE_URL}/login`, body);
  }

  forgetPassword(body: any): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}/forgetPassword`, body);
  }

  loggedIn() {
    if (isPlatformBrowser(this.platfrom)) {
      return !!localStorage.getItem('auth_token');
    }
  }
  logoutUser() {
    if (isPlatformBrowser(this.platfrom)) {
      localStorage.removeItem('auth_token');
      this.router.navigate(['/home']);
    }
  }
  getCurrentUser() {
    if (isPlatformBrowser(this.platfrom)) {
      const token = localStorage.getItem('auth_token');
      let payload;
      if (token) {
        payload = jwt_decode(token);
        return payload.data;
      }
        return;
    }
  }

  setToken(token_name, token) {
    if (isPlatformBrowser(this.platfrom)) {
      if (token_name === 'access_token') {
        this.access_token = token;
      // } else if (token_name === 'auth_token') {
      //   this.auth_token = token;
      } else {
        localStorage.setItem(token_name, token);
      }
    }
  }
  getToken(token_name) {
    if (isPlatformBrowser(this.platfrom)) {
      if (token_name === 'access_token') {
        return this.access_token;
      // } else if (token_name === 'auth_token') {
      //   return this.auth_token;
      } else {
        return localStorage.getItem(token_name);
      }
    }
  }
  deleteToken(token_name) {
    if (isPlatformBrowser(this.platfrom)) {
      if (token_name === 'access_token') {
        this.access_token = null;
        // } else if (token_name === 'auth_token') {
        //   this.auth_token = null;
        } else {
          localStorage.removeItem(token_name);
        }
      }
    }
}
