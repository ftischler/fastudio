import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public access_token;
  public auth_token;

  constructor(private cookieService: CookieService) {}

  setToken(token_name, token) {
    if (token_name === 'access_token') {
      this.access_token = token;
    } else if (token_name === 'auth_token') {
      this.auth_token = token;
    } else {
      localStorage.setItem(token_name, token);
    }
  }
  getToken(token_name) {
    if (token_name === 'access_token') {
      return this.access_token;
    } else if (token_name === 'auth_token') {
      return this.auth_token;
    } else {
      localStorage.getItem(token_name);
    }
  }
  deleteToken(token_name) {
    if (token_name === 'access_token') {
      this.access_token = null;
    } else if (token_name === 'auth_token') {
      this.auth_token = null;
    } else {
      localStorage.removeItem(token_name);
    }
  }
}
