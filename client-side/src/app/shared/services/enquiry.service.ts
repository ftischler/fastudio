import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Enquiry } from '../models/enquiry';
import { environment } from '../../../environments/environment';

// const BASE_URL = 'http://localhost:3000/v1';
const BASE_URL = `${environment.BASE_URL}/v1`;
@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  createEnquiry(design: any, enquiry: any): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}/enquiry`, {
      design,
      enquiry
    });
  }
  getEnquiries(): Observable<any> {
    return this.httpClient.get<Enquiry>(`${BASE_URL}/enquiry`);
  }
  updateEnquiry(id: string, body: any): Observable<any> {
    return this.httpClient.put<any>(`${BASE_URL}/enquiry/${id}`, body);
  }
  deleteEnquiry(id: string): Observable<any> {
    return this.httpClient.delete<Enquiry>(`${BASE_URL}/enquiry/${id}`);
  }
}
