import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  socket: any;
  newEnquiries: any;
  loggedInUser: any;

  @Output()
  toggleSidenav = new EventEmitter<void>();
  constructor(
    private router: Router,
    public authService: AuthService,
    public userService: UsersService,
    private socketService: SocketService
  ) { this.socket = this.socketService.connect();}

  ngOnInit() {
    this.loggedInUser = this.authService.getCurrentUser();
    this.getEnquires();
    this.socket.on('refreshPage', data => {
      this.getEnquires();
    });
  }
  getEnquires() {
    if (this.loggedInUser) {
      this.userService.getUser(this.loggedInUser._id).subscribe(data => {
        this.newEnquiries = data.user.enquiries.filter(enquiry => {
          return enquiry.closed === false;
        });
      });
    }
    return;
  }
}
