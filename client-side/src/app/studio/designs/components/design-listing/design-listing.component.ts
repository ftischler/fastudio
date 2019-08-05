import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DesignService } from '../../../../shared/services/design.service';
import { DesignDetailsComponent } from '../design-details/design-details.component';
import { CountryService } from '../../../../shared/services/country.service';
import { environment } from '../../../../../environments/environment';
import { SocketService } from '../../../../shared/services/socket.service';

@Component({
  selector: 'app-design-listing',
  templateUrl: './design-listing.component.html',
  styleUrls: ['./design-listing.component.scss']
})
export class DesignListingComponent implements OnInit {
  socket: any;
  locked: Boolean = environment.locked;
  allDesigns: any = [];
  designs: any = [];
  countries: any;
  country: any;
  state: any;
  search: any;
  spinner: Boolean = false;
  loading: Boolean = true;
  all: Boolean = false;
  counter: any = 0;

  constructor(
    public dialog: MatDialog,
    private designService: DesignService,
    private countryService: CountryService,
    private socketService: SocketService,
    private snackBar: MatSnackBar) {
    this.socket = this.socketService.connect();
  }

  ngOnInit() {
    this.all = true;
    this.getCountries();
    this.getDesigns();
    this.socket.on('refreshPage', () => {
      this.getDesigns();
    });
  }
  getCountries() {
    this.countryService.getCountries().subscribe(
      countries => {
        this.countries = countries;
      }
    );
  }

  getDesigns() {
    this.counter = 0;
    this.designService.getDesigns(this.counter).subscribe(data => {
      this.loading = false;
      this.designs = data.designs;
      if (this.designs.length < 20) {
        this.all = true;
      } else {
        this.all = false;
      }
    },
     err => {
       this.loading = false;
       this.errorHandler(err, 'failed to get designs');
     });
  }
  openMore() {
    this.spinner = true;
    this.counter = this.counter + 20;
    this.designService.getDesigns(this.counter).subscribe(data => {
      this.designs.push(...data.designs);
      this.spinner = false;
      if (data.designs.length < 20) {
        this.all = true;
      } else {
        this.all = false;
      }
    },
     // calling the snackbar errorhandler
     err => {
       this.spinner = false;
       this.errorHandler(err, 'Failed to load designs');
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
