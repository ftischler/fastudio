import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import * as io from 'socket.io-client';
import { CountryService } from '../../../../shared/services/country.service';
import { UsersService } from '../../../../shared/services/users.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  socket: any;
  userForm: FormGroup;
  selected: any;
  success: Boolean;
  error: string;
  click: Boolean = false;
  states: any;
  countries: any;

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private countryService: CountryService,
    private userService: UsersService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { this.socket = io(environment.BASE_URL); }

  ngOnInit() {
    // this.getCountries();
    this.states = this.countryService.nigeriaStates;
    this.createUserForm();
    this.setUserToForm();
  }

  // getCountries() {
  //   this.countryService.getCountries().subscribe(
  //     countries => {
  //       this.countries = countries;
  //     }
  //   );
  // }
  onSubmit() {
    this.click = true;
     this.userService.updateUser(this.data.userData._id, this.userForm.value).subscribe(
      data => {
        this.click = false;
        this.socket.emit('refresh', {});
        this.snackBar.open('Profile Updated', 'Success', {
          duration: 2000
        });
        this.dialogRef.close();
      },
      // calling the snackbar errorhandler
      err => this.errorHandler(err, 'Failed to update profile')
    );
  }
  private setUserToForm() {
    if (!this.data) {
      return;
    }
    const userData = {
      state: this.data.userData.state,
      city: this.data.userData.city,
      phone: this.data.userData.phone,
      address: this.data.userData.address
    };
    this.userForm.patchValue(userData);
  }

  createUserForm() {
    this.userForm = this.fb.group({
      state: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }
  // error handling with snackbar
  private errorHandler(error, message) {
    this.click = false;
    console.error(message);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

}

// change password
@Component({
  selector: 'app-change-password',
  template: `
  <button mat-button
  class="close"
  type="reset" [mat-dialog-close]="false"
  matTooltip="close">
    <i class="fas fa-times"></i>
  </button>
  <mat-dialog-content>
  <mat-card>
    <div *ngIf="success == false">
      <form class="form-container" [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
        <mat-form-field color="accent">
          <i matPrefix class="fas fa-lock-open">&nbsp;</i>
          <input #nPass matInput minlength="8" placeholder="Current Password" type="password" formControlName="currentPassword">
          <mat-error *ngIf="passwordForm.controls.currentPassword.invalid && passwordForm.controls.currentPassword.touched">enter your current password(8 characters minimum)</mat-error>
        </mat-form-field><br>

        <mat-form-field color="accent">
          <i matPrefix class="fas fa-key">&nbsp;</i>
          <input #nPass matInput minlength="8" placeholder="New Password" type="password" formControlName="newPassword">
          <mat-error *ngIf="passwordForm.controls.newPassword.invalid && passwordForm.controls.newPassword.touched">new password field is required(8 characters minimum)</mat-error>
        </mat-form-field><br>

        <mat-form-field color="accent">
          <i matPrefix class="fas fa-unlock-alt">&nbsp;</i>
          <input #cPass minlength="8" matInput placeholder="Confirm Password" type="password" formControlName="confirmPassword">
          <mat-error *ngIf="passwordForm.controls.confirmPassword.invalid && passwordForm.controls.confirmPassword.touched">confirm new password</mat-error>
        </mat-form-field><br>
        <div>
          <button mat-raised-button type="reset" [mat-dialog-close]="false">
            Cancel
          </button>
          <button mat-raised-button [disabled]="click == true || !passwordForm.valid" type="submit" color="accent">
            Reset
          </button>
        </div>
      </form>
    </div>
    <div *ngIf="success == true">
      <div class="success">
        <mat-icon>check_circle_outline</mat-icon>
        <h4>Password changed successfully</h4>
      </div>
    </div><br>
    <span *ngIf="click == true">
      <mat-spinner [diameter]="20"></mat-spinner>
    </span>
    <div class="error" *ngIf="sendError && success == false">
      <h4>{{sendError}}</h4>
    </div><br>
  </mat-card>
  </mat-dialog-content>
  `,
  styles: [`
  .close {
    color: rgb(180, 23, 23);
    margin: 0 20% 5px 80%;
    border: none;
  }
  .mat-spinner {
    margin: 10px auto;
  }
  .success {
    color: rgb(6, 252, 149);
    text-align: center;
    padding: 2px;
    border: 5px dotted rgb(6, 252, 149);
  }
  .error {
    color: red;
    text-align: justify;
    padding: 2px;
    border: 5px dotted red;
  }
  `]
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  success: Boolean = false;
  sendError: String;
  click: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public userService: UsersService,
    ) { }

  ngOnInit() {
    this.createForm();
  }
  onSubmit() {
    this.click = true;
    this.sendError = null;
    this.userService.changePassword(this.data.id, this.passwordForm.value).subscribe(
      data => {
        this.click = false;
        this.success = true;
      },
      err => {
        this.click = false;
        this.success = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            this.sendError = err.error.message[0].message;
          } else {
           this.sendError = err.error.msg;
        }
        }
      });
  }
  // form builder model
  private createForm() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
}
