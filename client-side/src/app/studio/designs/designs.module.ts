import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignListingComponent } from './components/design-listing/design-listing.component';
import { DesignDetailsComponent } from './components/design-details/design-details.component';
import { DesignersPortfolioComponent } from './components/designers-portfolio/designers-portfolio.component';
import { SharedModule } from '../../shared/shared.module';
import { DesignService } from '../../shared/services/design.service';
import { EnquiryService } from '../../shared/services/enquiry.service';

@NgModule({
  declarations: [
    DesignListingComponent,
    DesignDetailsComponent,
    DesignersPortfolioComponent
  ],
  imports: [CommonModule, SharedModule],
  providers: [EnquiryService, DesignService],
  entryComponents: [DesignDetailsComponent]
})
export class DesignsModule {}
