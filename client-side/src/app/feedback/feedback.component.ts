import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService } from '../shared/services/feedback.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  success: Boolean = false;
  sendError: string;
  click: Boolean = false;


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private feedbackService: FeedbackService) { }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      tel: ['', Validators.required],
      message: ['', Validators.required],
    });
  }
  onSubmit() {
    this.click = true;
    this.sendError = null;
    this.feedbackService.create(this.feedbackForm.value).subscribe(data => {
      this.feedbackForm.reset();
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
         // calling the snackbar errorhandler
        this.errorHandler(err, 'failed to process request');
        }
      }
    });
  }
  // error handling with snackbar
  private errorHandler(error, message) {
    console.error(message);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

}
