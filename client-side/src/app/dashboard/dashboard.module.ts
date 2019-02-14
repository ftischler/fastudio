import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DesignersForumModule } from './designers-forum/designers-forum.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ProfileModule } from './profile/profile.module';
import { EnquiriesModule } from './enquiries/enquiries.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    DesignersForumModule,
    PortfolioModule,
    ProfileModule,
    EnquiriesModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {}
