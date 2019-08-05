import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { DesignService } from '../../../../shared/services/design.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { SocketService } from '../../../../shared/services/socket.service';

// const URL = 'http://localhost:3000/v1/designs';
const URL = `${environment.BASE_URL}/v1/designs`;
@Component({
  selector: 'app-design-form',
  templateUrl: './design-form.component.html',
  styleUrls: ['./design-form.component.scss'],
})
export class DesignFormComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });
  regError: string;
  regClick: Boolean = false;
  design: any;
  socket: any;
  designForm: FormGroup;
  categories = [
    'Senator Style',
    'Agbada Style',
    'Kaftan Style',
    'Ankara Style',
    'Kente Style',
    'Iro and Buba Style',
    'Wedding Style',
    'English Style',
    'Simple Style',
    'Others'
  ];
  subCategories = [
    'Adult',
    'Teenager',
    'Kiddies'
  ];
  genders = [
    'Male',
    'Female',
    'Unisex'
  ];
  selectedFile: any;

  constructor(
    public dialogRef: MatDialogRef<DesignFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public designService: DesignService,
    private route: ActivatedRoute,
    private socketService: SocketService
    ) {
      this.socket = this.socketService.connect();
    }

  ngOnInit() {
    this.createForm();
    this.setDesignToForm();
  }
  onSubmit() {
    this.regClick = true;
    this.regError = null;
    const body = {
      image: this.selectedFile,
      description: this.designForm.value.description,
      category: this.designForm.value.category,
      subCategory: this.designForm.value.subCategory,
      gender: this.designForm.value.gender,
      priceWorth: this.designForm.value.priceWorth
     };
    // user wants to update design
    if (this.design) {
      this.designService.updateDesign(this.design._id, body).subscribe(
        data => {
          this.socket.emit('refresh', {});
          this.snackBar.open('Design Updated', 'Success', {
            duration: 2000
          });
          this.dialogRef.close();
        },
        err => {
          this.regClick = true;
          if (err instanceof HttpErrorResponse) {
            if (err.status === 400) {
              this.regError = err.error.msg[0].message;
            } else {
             this.regError = err.error.msg;
             // calling the snackbar errorhandler
            this.errorHandler(err, 'failed to update');
            }
          }
        }
      );
    } else {
      this.designService.createDesign(body).subscribe(
        data => {
          this.regClick = false;
          this.socket.emit('refresh', {});
          this.snackBar.open('Design created', 'Success', {
            duration: 2000
          });
          this.dialogRef.close();
        },
        err => {
          this.regClick = false;
          if (err instanceof HttpErrorResponse) {
            if (err.status === 400) {
              this.regError = err.error.msg[0].message;
            } else {
             this.regError = err.error.msg;
             // calling the snackbar errorhandler
            this.errorHandler(err, 'Failed to create design');
            }
          }
        }
      );
    }
  }
  // image upload method start
  ReadAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', event => {
        reject(event);
      });
      reader.readAsDataURL(file);
    });
    return fileValue;
  }
  OnFileSelected(event) {
    const file: File = event[0];
    this.ReadAsBase64(file)
    .then(result => {
      this.selectedFile = result;
    })
    .catch(err => console.log(err));
  }
  // image upload method ends

  private setDesignToForm() {
    if (!this.data) {
      return;
    }
    const id = this.data.id;
    this.designService.getDesign(id).subscribe(data => {
      this.design = data.design;
      this.designForm.patchValue(this.design);
    },
    // calling the snackbar errorhandler
    err => this.errorHandler(err, 'Failed to get design'));
  }
  // form builder model
  private createForm() {
    this.designForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      gender: ['', Validators.required],
      priceWorth: ['', Validators.required]
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
