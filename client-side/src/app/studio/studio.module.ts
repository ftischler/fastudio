import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudioRoutingModule } from './studio-routing.module';
import { StudioComponent } from './studio.component';
import { SharedModule } from '../shared/shared.module';
import { DesignsModule } from './designs/designs.module';
import { HairStylesModule } from './hair-styles/hair-styles.module';

@NgModule({
  declarations: [StudioComponent],
  imports: [
    CommonModule,
    SharedModule,
    DesignsModule,
    HairStylesModule,
    StudioRoutingModule
  ]
})
export class StudioModule {}
