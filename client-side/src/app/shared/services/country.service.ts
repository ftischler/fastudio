import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.BASE_URL}/v1`;
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  nigeriaStates = [
    'Abia',
    'Adamawa',
    'Anambra',
    'Akwa Ibom',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Enugu',
    'Edo',
    'Ekiti',
    'FCT - Abuja',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara'
  ];
  body = {
    user: 'visitor',
    origin: 'fastudioNG'
  };

  private httpClient: HttpClient;
  constructor(private handler: HttpBackend, private router: Router) {
    this.httpClient = new HttpClient(handler);
  }

  requestToken(): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}/giveMeAccess`, this.body);
  }

  getCountries(): Observable<any> {
    return this.httpClient.get(
      'http://restcountries.eu/rest/v2/region/africa?fields=name;callingCodes;currencies;flag;demonym'
    );
  }
}
