import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Design } from '../models/design';
import { environment } from '../../../environments/environment';

// const BASE_URL = 'http://localhost:3000/v1';
const BASE_URL = `${environment.BASE_URL}/v1`;
@Injectable({
  providedIn: 'root'
})
export class DesignService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  createDesign(body: any): Observable<any> {
    return this.httpClient.post<Design>(`${BASE_URL}/designs`, body);
  }
  getDesigns(len: any): Observable<any> {
    return this.httpClient.get<Design>(`${BASE_URL}/designs/skip=${len}`);
  }
  getUsersDesigns(id: any, len: any): Observable<any> {
    return this.httpClient.get<Design>(`${BASE_URL}/designs/designersId=${id}/skip=${len}`);
  }
  updateDesign(id: string, body: any): Observable<Design> {
    return this.httpClient.put<Design>(`${BASE_URL}/designs/${id}`, body);
  }
  deleteDesign(id: string): Observable<Design> {
    return this.httpClient.delete<Design>(`${BASE_URL}/designs/${id}`);
  }
  // get by id for editing
  getDesign(id: string): Observable<any> {
    return this.httpClient.get<Design>(`${BASE_URL}/designs/${id}`);
  }
}
