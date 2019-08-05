import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../shared/services/auth.service';
import { UsersService } from '../../../../shared/services/users.service';
import { EnquiryService } from '../../../../shared/services/enquiry.service';
import { Enquiry } from '../../../../shared/models/enquiry';
import { EnquiriesDetailsComponent } from '../enquiries-details/enquiries-details.component';
import { environment } from '../../../../../environments/environment';
import { SocketService } from '../../../../shared/services/socket.service';

@Component({
  selector: 'app-enquiries-listing',
  templateUrl: './enquiries-listing.component.html',
  styleUrls: ['./enquiries-listing.component.scss']
})
export class EnquiriesListingComponent implements OnInit {
  socket: any;
  loading: Boolean = true;
  loggedInUser: any;
  displayedColumns: string[] = ['client', 'class', 'status', 'action'];
  dataSource: MatTableDataSource<Enquiry>;
  length: number;

  constructor(private enquiryService: EnquiryService,
              private userService: UsersService,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private socketService: SocketService
            ) {
    this.socket = this.socketService.connect();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.loggedInUser = this.authService.getCurrentUser();
    this.getEnquires();
    this.socket.on('refreshPage', data => {
      this.getEnquires();
    });
  }

  getEnquires() {
    if (this.loggedInUser) {
      this.userService.getUser(this.loggedInUser._id).subscribe(
        data => {
          this.loading = false;
          this.dataSource = new MatTableDataSource(data.user.enquiries.sort( (a, b) => {
            return (a.closed === b.closed) ? 0 : a.closed ? -1 : 1;
          }).reverse());
          this.dataSource.paginator = this.paginator;
          this.length = data.user.enquiries.length;
        },
        err => {
          this.loading = false;
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.router.navigate(['/home']);
            } else {
              // calling the snackbar errorhandler
              this.errorHandler(err, 'failed to get enquiries');
            }
          }
        },
      );
    }
    return;
  }

  // filtering table data
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
   // dialog to open details
   detailsBtnHandler(_enquiry) {
    this.dialog.open(EnquiriesDetailsComponent, {
      data: { enquiry: _enquiry, userData: this.loggedInUser },
      width: '600px',
    });
  }
  // close an enquiry
  closeBtnHandler(_id) {
    this.dialog.open(ConfirmCloseComponent, {
      data: { id: _id },
      width: '250px'
    });
  }
  // delete an enquiry
  deleteBtnHandler(_id) {
    this.dialog.open(DeleteEnquiryComponent, {
      data: { id: _id },
      width: '250px'
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

// confirm close
@Component({
  selector: 'app-confirm-close',
  template: `
  <h1 mat-dialog-title>Design Completed</h1>
  <div mat-dialog-content>
    <p>You are about to close this enquiry?</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)=onNoClick()>No Thanks</button>
    <button mat-button (click)=onYesClick()>Yes</button>
  </div>
  `,
  styles: [``]
})
export class ConfirmCloseComponent implements OnInit {
  socket: any;

  constructor(public dialogRef: MatDialogRef<ConfirmCloseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private enquiryService: EnquiryService,
    private snackBar: MatSnackBar,
    ) { this.socket = io(environment.BASE_URL); }

  ngOnInit() {
  }
  onNoClick() {
    this.socket.emit('refresh', {});
    this.dialogRef.close();
  }
  onYesClick() {
    const body = {
      closed: true
    };
    this.enquiryService.updateEnquiry(this.data.id, body).subscribe(
      data => {
        this.snackBar.open('Enquiry closed successsfully', 'Completed', {
          duration: 2000
        });
        this.socket.emit('refresh', {});
        this.dialogRef.close();
      },
      err => {
        this.errorHandler(err, 'Failed to close enquiry');
      }
    );
  }
  // error handling with snackbar
  private errorHandler(error, message) {
    console.error(message);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}

// confirm delete
@Component({
  selector: 'app-delete-enquiry',
  template: `
  <h1 mat-dialog-title>Delete!</h1>
  <div mat-dialog-content>
    <p>Delete this enquiry?</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)=onNoClick()>No Thanks</button>
    <button mat-button (click)=onYesClick()>Yes</button>
  </div>
  `,
  styles: [``]
})
export class DeleteEnquiryComponent implements OnInit {
  socket: any;

  constructor(public dialogRef: MatDialogRef<DeleteEnquiryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private enquiryService: EnquiryService,
    private snackBar: MatSnackBar,
    ) { this.socket = io(environment.BASE_URL); }

  ngOnInit() {
  }
  onNoClick() {
    this.socket.emit('refresh', {});
    this.dialogRef.close();
  }
  onYesClick() {
    this.enquiryService.deleteEnquiry(this.data.id).subscribe(
      data => {
        this.snackBar.open('Enquiry deleted successsfully', 'Completed', {
          duration: 2000
        });
        this.socket.emit('refresh', {});
        this.dialogRef.close();
      },
      err => {
        this.errorHandler(err, 'Failed to delete enquiry');
      }
    );
  }
  // error handling with snackbar
  private errorHandler(error, message) {
    console.error(message);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}

