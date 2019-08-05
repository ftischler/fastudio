import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: AuthService, private router: Router,
              @Inject(PLATFORM_ID) private platformId: string) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (isPlatformServer(this.platformId) || this.userService.loggedIn()) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
