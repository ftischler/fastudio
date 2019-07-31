import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

// const BASE_URL = 'http://localhost:3000/v1';
const BASE_URL = `${environment.BASE_URL}/v1`;
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient, private router: Router) {}
  getDesigners(): Observable<any> {
    return this.httpClient.get<User>(`${BASE_URL}/users/all/designers`);
  }
  getUser(id): Observable<any> {
    return this.httpClient.get<User>(`${BASE_URL}/users/${id}`);
  }
  getUserByEmail(email): Observable<any> {
    return this.httpClient.get<User>(`${BASE_URL}/users/email/${email}`);
  }
  resetPassword(token: any, body: any): Observable<any> {
    return this.httpClient.put(`${BASE_URL}/users/passwordReset/${token}`, body);
  }
  updateUser(id: string, body: any): Observable<User> {
    return this.httpClient.put<User>(`${BASE_URL}/users/${id}`, body);
  }
  changePassword(id: string, body: any): Observable<User> {
    return this.httpClient.post<User>(
      `${BASE_URL}/updatePassword/userId/${id}`,
      body
    );
  }
}
