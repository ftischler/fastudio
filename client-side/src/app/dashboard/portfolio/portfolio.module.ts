import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignsComponent, DeleteDesignComponent } from './components/designs/designs.component';
import { DesignFormComponent } from './components/design-form/design-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignService } from '../../shared/services/design.service';

@NgModule({
  declarations: [DesignsComponent, DesignFormComponent, DeleteDesignComponent],
  imports: [CommonModule, SharedModule],
  providers: [DesignService],
  entryComponents: [DesignFormComponent, DeleteDesignComponent]
})
export class PortfolioModule {}
