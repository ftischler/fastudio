import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../../shared/shared.module';
import {
  EditProfileComponent,
  ChangePasswordComponent
} from './components/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent
  ],
  imports: [CommonModule, SharedModule],
  entryComponents: [EditProfileComponent, ChangePasswordComponent]
})
export class ProfileModule {}
