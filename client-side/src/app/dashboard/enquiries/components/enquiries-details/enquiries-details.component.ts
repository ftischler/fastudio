import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as io from 'socket.io-client';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';

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
    ) { this.socket = io(environment.BASE_URL); }

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
