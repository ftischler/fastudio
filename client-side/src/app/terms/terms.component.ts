import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TermsComponent>,
  ) { }

  ngOnInit() {
  }
  closeBtn() {
    this.dialogRef.close();
  }

}
