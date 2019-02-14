import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// export class TokenInterceptorService implements HttpInterceptor {
//   constructor(private injector: Injector) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const authService = this.injector.get(AuthService);
//     const headersConfig = {
//       'Content-Type': 'application/json',
//       Accept: 'application/json'
//     };
//     const token = authService.getToken();
//     if (token) {
//       headersConfig['Authorizaton'] = `Bearer ${token}`;
//       const tokenizedReq = req.clone({ setHeaders: headersConfig });
//       return next.handle(tokenizedReq);
//     } else {
//       return next.handle(req);
//     }
//   }
// }
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    if (authService.getToken()) {
      const tokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.getToken()}`
        }
      });
      return next.handle(tokenizedReq);
    }
    return next.handle(req);
  }

}
