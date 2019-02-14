import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudioComponent } from './studio.component';
import { DesignListingComponent } from './designs/components/design-listing/design-listing.component';
import { DesignersPortfolioComponent } from './designs/components/designers-portfolio/designers-portfolio.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: StudioComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DesignListingComponent
      },
      {
        path: 'portfolio/:email/designs',
        pathMatch: 'full',
        component: DesignersPortfolioComponent
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
export class StudioRoutingModule {}
