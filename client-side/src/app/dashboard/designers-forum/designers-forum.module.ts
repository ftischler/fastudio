import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignersForumComponent } from './designers-forum.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DesignersForumComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DesignersForumModule { }
