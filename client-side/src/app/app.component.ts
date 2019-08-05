import { Component, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { CountryService } from './shared/services/country.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { filterMiddleware } from '@nestjs/core/middleware/utils';
import { filter } from 'rxjs/operators';

const MAX_WIDTH_BREAKPOINT = 600;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  BtnClick: Boolean = false;
  private _mobileQueryListener: () => void;

  private isServer = isPlatformServer(this.platformId);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    mediaMatcher: MediaMatcher,
    private router: Router,
    public authService: AuthService,
    public countryService: CountryService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    if (this.isBrowser) {
      this.mobileQuery = mediaMatcher.matchMedia(
        `(max-width : ${MAX_WIDTH_BREAKPOINT}px)`
      );

      this._mobileQueryListener = () => {
        changeDetectorRef.detectChanges();
      }
      this.mobileQuery.addListener(this._mobileQueryListener);
      // create acccess token for visitors
      countryService.requestToken().pipe(
        filter(() => this.isServer)
      ).subscribe(
        data => {
          // storing the generated token
          authService.setToken('access_token', data.token);
        }, err => {
          return;
        }
      );
    }
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  isScreenSmall() {
    return this.mobileQuery.matches;
  }

  btnClick() {
    this.BtnClick = true;
  }
}
