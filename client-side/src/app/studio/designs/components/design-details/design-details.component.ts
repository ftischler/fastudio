import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DesignService } from 'src/app/shared/services/design.service';
import { EnquiryService } from 'src/app/shared/services/enquiry.service';
import * as io from 'socket.io-client';
import { HttpErrorResponse } from '@angular/common/http';
import { CountryService } from 'src/app/shared/services/country.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-design-details',
  templateUrl: './design-details.component.html',
  styleUrls: ['./design-details.component.scss']
})
export class DesignDetailsComponent implements OnInit {
  requestForm: FormGroup;
  design: any;
  socket: any;
  success: Boolean = false;
  click: Boolean = false;
  regError: string;
  countries: any;
  selected: any;
  genders = [
    'Male',
    'Female',
  ];

  constructor(
    public dialogRef: MatDialogRef<DesignDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public designService: DesignService,
    public enquiryService: EnquiryService,
    public countryService: CountryService,
    private route: ActivatedRoute,
    ) {
      this.socket = io(environment.BASE_URL);
    }
  ngOnInit() {
    this.getCountries();
    this.createForm();
    this.getDesign();
  }
  getCountries() {
    this.countryService.getCountries().subscribe(
      countries => {
        this.countries = countries;
      }
    );
  }
  onSubmit() {
    this.click = true;
    this.regError = null;
    this.success = false;
    this.enquiryService.createEnquiry(this.design, this.requestForm.value).subscribe(data => {
      this.click = false;
      this.requestForm.reset();
      this.success = true;
    },
    err => {
      this.click = false;
      this.success = false;
      if (err instanceof HttpErrorResponse) {
        if (err.status === 400) {
          this.regError = err.error.msg[0].message;
        } else {
         this.regError = err.error.msg;
         // calling the snackbar errorhandler
        this.errorHandler(err, 'failed to process request');
        }
      }
    });
  }
  private getDesign() {
    if (!this.data) {
      return;
    }
    this.designService.getDesign(this.data.id).subscribe(data => {
      this.design = data.design;
    },
    // calling the snackbar errorhandler
    err => this.errorHandler(err, 'failed to load design details'));
  }
  // form builder model
  private createForm() {
    this.requestForm = this.fb.group({
      name: ['', Validators.required],
      email: '',
      country: [{}, Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      message: ['', Validators.required],
      gender: ['', Validators.required],
      size: ['', Validators.required]
    });
  }
  // error handling with snackbar
  private errorHandler(error, message) {
    console.error(message);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
  closeBtn() {
    this.socket.emit('refresh', {});
    this.dialogRef.close();
  }

}
