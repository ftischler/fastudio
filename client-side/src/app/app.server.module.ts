import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CountryService } from './shared/services/country.service';
import { Observable, of } from 'rxjs';
import { SocketService } from './shared/services/socket.service';

export class MockCountryService {
  requestToken(): Observable<any> {
    return of({token: ''});
  }

  getCountries(): Observable<any> {
    return of([]);
  }
}

export class MockSocketService {
  socket = {
    on: () => {
      // noop
    },
    emit: () => {
      // noop
    }
  };
  connect() {
    return this.socket;
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    NoopAnimationsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: CountryService, useClass: MockCountryService},
    {provide: SocketService, useClass: MockSocketService}
  ]
})
export class AppServerModule {}
