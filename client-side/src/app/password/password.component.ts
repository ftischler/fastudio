import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../shared/services/users.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  passwordForm: FormGroup;
  token: any;
  fullname: string;
  success: Boolean = false;
  sendError: String;
  click: Boolean = false;

  constructor(private fb: FormBuilder,
    public authService: AuthService,
    public userService: UsersService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.fullname = this.route.snapshot.params.fullname;
    this.token = this.route.snapshot.params.token;
    this.createForm();
  }
  onSubmit() {
    this.click = true;
    this.userService.resetPassword(this.token, this.passwordForm.value).subscribe(
      data => {
        this.click = false;
        this.success = true;
      },
      err => {
        this.click = false;
        this.success = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            this.sendError = err.error.msg[0].message;
          } else {
           this.sendError = err.error.msg;
        }
        }
      });
  }
  // form builder model
  private createForm() {
    this.passwordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
}


// forget password component
@Component({
  selector: 'app-forget-password',
  template: `
  <mat-dialog-content>
    <mat-card>
      <form *ngIf="success == false"
      class="form-container" [formGroup]="emailForm" novalidate
      (ngSubmit)="onSubmit()">
        <h3> Forget password? </h3>
        <mat-form-field color="primary">
          <input matInput type="email" placeholder="Enter Registered Email" formControlName="email">
          <mat-error *ngIf="emailForm.controls.email.invalid && emailForm.controls.email.touched">enter a valid email address</mat-error>
        </mat-form-field>
        <button mat-raised-button [disabled]="click == true || !emailForm.valid" type="submit" color="accent">Submit</button>
        <button mat-raised-button type="reset" [mat-dialog-close]="false">Close</button>
      </form>
      <div class="success" *ngIf="success == true">
        <i>Success! A password reset link has been sent to {{emailForm.controls.email.value}}<br>Check your mail inbox or spam to reset your password and access your portfolio.<br>Note: Your email may take a few minutes to arrive.</i>
      </div><br>
      <span *ngIf="click == true">
        <mat-spinner [diameter]="20"></mat-spinner>
      </span>
      <div class="error" *ngIf="sendError && success == false">
        <i>{{sendError}}</i>
      </div><br>
    </mat-card>
  </mat-dialog-content>
  `,
  styles: [`
  .mat-spinner {
    margin: 10px auto;
  }
  .success {
    color: rgb(6, 252, 149) !important;
    text-align: center;
    padding: 2px;
    border: 5px dotted rgb(6, 252, 149);
  }
  .error {
    color: red !important;
    text-align: justify;
    padding: 2px;
    border: 5px dotted red;
  }
  `]
})
export class ForgetPasswordComponent implements OnInit {
  emailForm: FormGroup;
  success: Boolean = false;
  sendError: String;
  click: Boolean = false;

  constructor(public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.createForm();
  }
  onSubmit() {
    this.click = true;
    this.sendError = null;
    this.authService.forgetPassword(this.emailForm.value).subscribe(
      data => {
        this.click = false;
        this.success = true;
      },
      err => {
        this.click = false;
        this.success = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            this.sendError = err.error.msg[0].message;
          } else {
           this.sendError = err.error.msg;
        }
        }
      });
    }

   // form builder model
   private createForm() {
    this.emailForm = this.fb.group({
      email: ['', Validators.required],
    });
  }
}
