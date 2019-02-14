import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { DesignsComponent } from './portfolio/components/designs/designs.component';
import { EnquiriesListingComponent } from './enquiries/components/enquiries-listing/enquiries-listing.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { DesignersForumComponent } from './designers-forum/designers-forum.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'portfolio'
      },
      {
        path: 'enquiries',
        component: EnquiriesListingComponent
      },
      {
        path: 'portfolio',
        component: DesignsComponent
      },
      {
        path: 'designers-forum',
        component: DesignersForumComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
