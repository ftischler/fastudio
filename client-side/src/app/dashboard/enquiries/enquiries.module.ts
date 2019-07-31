import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EnquiriesListingComponent,
  ConfirmCloseComponent,
  DeleteEnquiryComponent
} from './components/enquiries-listing/enquiries-listing.component';
import { EnquiriesDetailsComponent } from './components/enquiries-details/enquiries-details.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    EnquiriesListingComponent,
    EnquiriesDetailsComponent,
    ConfirmCloseComponent,
    DeleteEnquiryComponent
  ],
  imports: [CommonModule, SharedModule],
  entryComponents: [EnquiriesDetailsComponent, ConfirmCloseComponent, DeleteEnquiryComponent]
})
export class EnquiriesModule {}
