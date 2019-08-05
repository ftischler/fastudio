import { Component, OnInit, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { DesignFormComponent } from '../design-form/design-form.component';
import * as moment from 'moment';
import { AuthService } from '../../../../shared/services/auth.service';
import { UsersService } from '../../../../shared/services/users.service';
import { DesignService } from '../../../../shared/services/design.service';
import { environment } from '../../../../../environments/environment';
import { SocketService } from '../../../../shared/services/socket.service';

@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.scss']
})
export class DesignsComponent implements OnInit {
  socket: any;
  designs: any[] = [];
  spinner: Boolean = false;
  loading: Boolean = true;
  all: Boolean = false;
  counter: any = 0;
  loggedInUser: any;
  userData: any;
  search: any;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public userService: UsersService,
    public designService: DesignService,
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private snackBar: MatSnackBar) {
    this.socket = this.socketService.connect();
  }

  ngOnInit() {
    this.all = true;
    this.loggedInUser = this.authService.getCurrentUser();
    this.getUserData();
    this.socket.on('refreshPage', () => {
      this.getUserData();
    });
  }
  getUserData() {
    this.userService.getUser(this.loggedInUser._id).subscribe(async data => {
      this.userData = data.user;
      this.counter = 0;
      await this.designService.getUsersDesigns(this.loggedInUser._id, this.counter).subscribe(_data => {
        this.loading = false;
        this.designs = _data.designs;
        if (this.designs.length < 20) {
          this.all = true;
        } else {
          this.all = false;
        }
      },
      err => {
        this.loading = false;
        if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          this.all = true;
        } else {
          // calling the snackbar errorhandler
          this.errorHandler(err, 'failed to get designs');
        }
      }
      });
    },
    err => {
      this.loading = false;
      // calling the snackbar errorhandler
      this.errorHandler(err, 'failed to get user data');
    });
  }
  openMore() {
    this.spinner = true;
    this.counter = this.counter + 20;
    this.designService.getUsersDesigns(this.loggedInUser._id, this.counter).subscribe(data => {
      this.designs.push(...data.designs);
      this.spinner = false;
      if (data.designs.length < 20) {
        this.all = true;
      } else {
        this.all = false;
      }
    },
     err => {
       this.spinner = false;
       if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          this.all = true;
        } else {
          // calling the snackbar errorhandler
          this.errorHandler(err, 'Failed to load designs');
        }
      }
     }
    );
  }

  openDesignForm() {
    this.dialog.open(DesignFormComponent, {
      height: '500px',
      width: '600px',
      autoFocus: false
    });
  }
  // open dialog to edit
  editBtnHandler(_id) {
    this.dialog.open(DesignFormComponent, {
      data: { id: _id },
      autoFocus: false
    });
  }
  // delete design
  deleteBtnHandler(_id) {
    this.dialog.open(DeleteDesignComponent, {
      data: { id: _id },
      width: '250px'
    });
  }
  // moment time
  TimeFromNow(time) {
    return moment(time).fromNow();
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
  selector: 'app-delete-design',
  template: `
  <h1 mat-dialog-title>Delete!</h1>
  <div mat-dialog-content>
    <p>Delete this design?</p>
    <mat-spinner [diameter]="20" *ngIf="click == true"></mat-spinner>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)=onNoClick()>No Thanks</button>
    <button mat-button (click)=onYesClick()>Yes</button>
  </div>
  `,
  styles: [`
  mat-spinner {
    margin: auto;
    width: 50%;
  }
  `]
})
export class DeleteDesignComponent implements OnInit {
  socket: any;
  click: Boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteDesignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private designService: DesignService,
    private snackBar: MatSnackBar,
    ) { this.socket = io(environment.BASE_URL); }

  ngOnInit() {
  }
  onNoClick() {
    this.socket.emit('refresh', {});
    this.dialogRef.close();
  }
  onYesClick() {
    this.click = true;
    this.designService.deleteDesign(this.data.id).subscribe(
      data => {
        this.click = false;
        this.snackBar.open('Design successfully deleted', 'Success', {
          duration: 2000
        });
        this.socket.emit('refresh', {});
        this.dialogRef.close();
      },
       // calling the snackbar errorhandler
      err => {
        this.click = false;
        this.errorHandler(err, 'Failed to delete design');
        this.dialogRef.close();
      }
    );
  }
  // error handling with snackbar
  private errorHandler(error, message) {
    console.error(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}
