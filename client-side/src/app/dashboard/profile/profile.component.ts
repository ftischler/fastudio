import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import * as io from 'socket.io-client';
import * as moment from 'moment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { EditProfileComponent, ChangePasswordComponent } from './components/edit-profile/edit-profile.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: any;
  notice: Boolean = true;
  socket: any;
  loggedInUser: any;
  subscription: any;
  active: Boolean;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UsersService,
    private snackBar: MatSnackBar) {
    this.socket = io(environment.BASE_URL);
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getCurrentUser();
    this.getUser();
    this.socket.on('refreshPage', data => {
      this.getUser();
    });
  }
  getUser() {
    this.userService.getUser(this.loggedInUser._id).subscribe(data => {
      this.userData = data.user;
      this.subscription = data.user.subscriptions.reverse();
      this.active = true;
      if (moment(this.subscription[0].end).isAfter(moment())) {
        this.active = true;
      } else {
        this.active = false;
      }
    },
    err => {
      this.errorHandler(err, 'failed to get userdata');
    });
  }
  editProfile() {
    this.dialog.open(EditProfileComponent, {
      data: { userData: this.userData },
      autoFocus: false
    });
  }
  changePassword() {
    this.dialog.open(ChangePasswordComponent, {
      data: { id: this.userData._id },
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
