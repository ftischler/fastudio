import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ResponsiveModule } from 'ngx-responsive';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { RatingsComponent } from './ratings/ratings.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/services/auth.guard';
import { TokenInterceptorService } from './shared/services/token-interceptor.service';
import { UsersService } from './shared/services/users.service';
import { TermsComponent } from './terms/terms.component';
import { PasswordComponent, ForgetPasswordComponent } from './password/password.component';
import { DesignersComponent } from './designers/designers.component';

const responConfig = {
  breakPoints: {
    xs: { max: 300 },
    sm: { min: 301, max: 600 },
    md: { min: 601, max: 960 },
    lg: { min: 960, max: 1920 },
    xl: { min: 1921 }
  },
  debounceTime: 100
};
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RatingsComponent,
    FeedbackComponent,
    TermsComponent,
    PasswordComponent,
    ForgetPasswordComponent,
    DesignersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ResponsiveModule.forRoot(responConfig),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    AuthService,
    UsersService,
    AuthGuard,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [TermsComponent, ForgetPasswordComponent]
})
export class AppModule {}
