import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import * as io from 'socket.io-client';
import _ from 'lodash';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-designers',
  templateUrl: './designers.component.html',
  styleUrls: ['./designers.component.scss']
})
export class DesignersComponent implements OnInit {
  socket: any;
  loggedInUser: any;
  loading: Boolean = true;
  view: Boolean = false;
  displayedColumns: string[] = ['designer', 'location', 'action'];
  dataSource: MatTableDataSource<User>;
  length: number;

  constructor(private userService: UsersService,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog
            ) { this.socket = io(environment.BASE_URL); }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    // this.loggedInUser = this.authService.getCurrentUser();
    this.getDesigners();
    this.socket.on('refreshPage', data => {
      this.getDesigners();
    });
  }

  getDesigners() {
    this.userService.getDesigners().subscribe(data => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(data.designers.sort(function(a, b) {
        const nameA = a.businessname.toLowerCase(), nameB = b.businessname.toLowerCase();
        if (nameA < nameB) {  return -1; }
        if (nameA > nameB) {  return 1; }
        return 0;
      }));
      this.dataSource.paginator = this.paginator;
      this.length = data.designers.length;
    },
     err => {
       this.loading = false;
       this.errorHandler(err, 'failed to get designers');
     });
  }

  // filtering table data
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // error handling with snackbar
  private errorHandler(error, message) {
    console.error(message);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}
