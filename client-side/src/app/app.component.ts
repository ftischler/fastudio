import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { CountryService } from './shared/services/country.service';

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

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    mediaMatcher: MediaMatcher,
    private router: Router,
    public authService: AuthService,
    public countryService: CountryService
  ) {
    this.mobileQuery = mediaMatcher.matchMedia(
      `(max-width : ${MAX_WIDTH_BREAKPOINT}px)`
    );
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // create acccess token for visitors
    countryService.requestToken().subscribe(
      data => {
        // storing the generated token
        localStorage.setItem('junks', data.token);
      }, err => {
        return;
      }
    );
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
