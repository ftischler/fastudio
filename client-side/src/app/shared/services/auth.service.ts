import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';

// const BASE_URL = 'http://localhost:3000/v1';
const BASE_URL = `${environment.BASE_URL}/v1`;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router) { }

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
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
  getCurrentUser() {
    const token = localStorage.getItem('token');
    let payload;
    if (token) {
      payload = jwt_decode(token);
      // payload = token.split('.')[1];
      // payload = JSON.parse(window.atob(payload));
      return payload.data;
    }
      return;
  }
}
