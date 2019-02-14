import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RatingsComponent } from './ratings/ratings.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AuthGuard } from './shared/services/auth.guard';
import { PasswordComponent } from './password/password.component';
import { DesignersComponent } from './designers/designers.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'ratings',
    component: RatingsComponent
  },
  {
    path: 'feedback',
    component: FeedbackComponent
  },
  {
    path: 'designers',
    component: DesignersComponent
  },
  {
    path: 'passwordReset/:fullname/:token',
    component: PasswordComponent
  },
  {
    path: 'studio',
    loadChildren: './studio/studio.module#StudioModule'
    // data: { preload: true, delay: false }
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
