import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { TermsComponent } from '../terms/terms.component';
import { CountryService } from '../shared/services/country.service';
import { ForgetPasswordComponent } from '../password/password.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  tokenForm: FormGroup;
  userForm: FormGroup;
  success: Boolean = false;
  verified: Boolean = false;
  error: string;
  regError: string;
  verifyError: string;
  regClick: Boolean = false;
  verifyClick: Boolean = false;
  click: Boolean = false;
  submitted: Boolean = false;
  BtnClick: Boolean = false;
  sexs = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'}
  ];
  states: any;
  countries: any;

  constructor(
    public authService: AuthService,
    private countryService: CountryService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getCountries();
    this.states = this.countryService.nigeriaStates;
    this.createLoginForm();
    this.createUserForm();
    this.createTokenForm();
  }
  getCountries() {
    this.countryService.getCountries().subscribe(
      countries => {
        this.countries = countries;
      }
    );
  }
  onSubmit() {
    this.error = null;
    this.submitted = true;
    this.authService.loginUser(this.loginForm.value).subscribe(
      data => {
        // remove junks token
        localStorage.removeItem('junks');
        // storing the generated token
        localStorage.setItem('token', data.token);
        this.router.navigate(['dashboard', 'portfolio']);
      },
      err => {
        this.submitted = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            this.error = err.error.message[0].message;
          } else if (err.status === 404) {
            this.loginForm.controls['password'].reset();
            this.error = err.error.msg;
            // calling the snackbar errorhandler
            this.errorHandler(err, 'Registration failed');
          }
        }
        // calling the snackbar errorhandler
        this.errorHandler(err, 'Login failed');
      }
    );
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  // error handling with snackbar
  private errorHandler(error, message) {
    console.error(message);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

  // user registration
  userOnSubmit() {
    this.regClick = true;
    this.regError = null;
    this.authService.createUser(this.userForm.value).subscribe(
      data => {
        this.regClick = false;
        this.success = true;
        this.verified = false;
        this.snackBar.open('Registered Successfully', 'Success', {
          duration: 1000
        });
        // storing the generated token
        // localStorage.setItem('token', data.token);
      },
      err => {
        this.regClick = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            this.regError = err.error.message[0].message;
          } else {
           this.regError = err.error.msg;
           // calling the snackbar errorhandler
          this.errorHandler(err, 'Registration failed');
          }
        }
      }
    );
  }

  createUserForm() {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      businessname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      country: [{}, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      oath: [false, Validators.requiredTrue]
    });
  }

  createTokenForm() {
    this.tokenForm = this.fb.group({
      token: ['', Validators.required],
    });
  }

  verifyMe() {
    this.verifyClick = true;
    const body = {
      token: this.tokenForm.value.token,
      phone: this.userForm.value.phone,
      country: this.userForm.value.country
    };
    this.authService.verifyUser(this.userForm.value.email, body).subscribe(
      data => {
        this.verifyClick = false;
        this.verified = true;
        this.snackBar.open('Verification Successful', 'Success', {
          duration: 1000
        });
      },
      err => {
        this.verifyClick = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            this.verifyError = err.error.message[0].message;
          } else {
           this.verifyError = err.error.msg;
           // calling the snackbar errorhandler
          this.errorHandler(err, 'Verification failed');
          }
        }
      }
    );
  }
  resetForm() {
    this.success = false;
    this.regError = null;
    this.userForm.reset();
  }
  terms() {
    this.dialog.open(TermsComponent, {
      autoFocus: false
    });
  }
  forgetPassword() {
    this.dialog.open(ForgetPasswordComponent, {
      autoFocus: false
    });
  }
  btnClick() {
    this.BtnClick = true;
  }
}
