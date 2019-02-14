import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { FileUploadModule } from 'ng2-file-upload';
import { FooterComponent } from './components/footer/footer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

const exportedSharedModules = [
  MaterialModule,
  FileUploadModule,
  Ng2SearchPipeModule
];
@NgModule({
  declarations: [
    FooterComponent,
    NotFoundComponent,
    SidenavComponent,
    ToolbarComponent
  ],
  imports: [CommonModule, RouterModule, ...exportedSharedModules],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FooterComponent,
    NotFoundComponent,
    SidenavComponent,
    ToolbarComponent,
    ...exportedSharedModules
  ]
})
export class SharedModule {}
