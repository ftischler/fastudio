import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as moment from 'moment';
import { AuthService } from '../../../../shared/services/auth.service';
import { UsersService } from '../../../../shared/services/users.service';
import { DesignService } from '../../../../shared/services/design.service';
import { environment } from '../../../../../environments/environment';
import { DesignDetailsComponent } from '../design-details/design-details.component';

@Component({
  selector: 'app-designers-portfolio',
  templateUrl: './designers-portfolio.component.html',
  styleUrls: ['./designers-portfolio.component.scss']
})
export class DesignersPortfolioComponent implements OnInit {
  socket: any;
  designs: any[] = [];
  userData: any;
  spinner: Boolean = false;
  loading: Boolean = true;
  all: Boolean = false;
  counter: any = 0;
  designerEmail: String;
  search: any;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public userService: UsersService,
    public designService: DesignService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) {
    this.socket = io(environment.BASE_URL);
    this.loading = true;
  }

  ngOnInit() {
    this.all = true;
    this.designerEmail = this.route.snapshot.params.email;
    this.getUserDesigns();
    this.socket.on('refreshPage', () => {
      this.getUserDesigns();
    });
  }
  getUserDesigns() {
    this.userService.getUserByEmail(this.designerEmail).subscribe(async data => {
      if (data.user == null) {
        this.router.navigate(['not-found'], {relativeTo: this.route, skipLocationChange: true});
      } else {
        this.userData = data.user;
        this.counter = 0;
        await this.designService.getUsersDesigns(data.user._id, this.counter).subscribe(_data => {
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
      }
    },
    err => {
      this.router.navigate(['not-found'], {relativeTo: this.route, skipLocationChange: true});
    });
  }
  openMore() {
    this.spinner = true;
    this.counter = this.counter + 20;
    this.designService.getUsersDesigns(this.userData._id, this.counter).subscribe(data => {
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
  detailBtnHandler(_id) {
    this.dialog.open(DesignDetailsComponent, {
      data: { id: _id },
      autoFocus: false
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
