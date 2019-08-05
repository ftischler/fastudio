import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { SocketService } from '../../../../shared/services/socket.service';

@Component({
  selector: 'app-enquiries-details',
  templateUrl: './enquiries-details.component.html',
  styleUrls: ['./enquiries-details.component.scss']
})
export class EnquiriesDetailsComponent implements OnInit {
  socket: any;
  enquiry: any;
  userData: any;

  constructor(public dialogRef: MatDialogRef<EnquiriesDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
              private socketService: SocketService
    ) { this.socket = this.socketService.connect(); }

  ngOnInit() {
    if (!this.data) {
      return;
    }
    this.userData = this.data.userData;
    this.enquiry = this.data.enquiry;
  }
  closeBtn() {
    this.socket.emit('refresh', {});
    this.dialogRef.close();
  }
    // moment time
   TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
