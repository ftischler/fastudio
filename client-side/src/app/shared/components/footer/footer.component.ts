import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from '../../../feedback/feedback.component';
import { TermsComponent } from '../../../terms/terms.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }
  feedback() {
    this.dialog.open(FeedbackComponent, {
      autoFocus: false
    });
  }
  terms() {
    this.dialog.open(TermsComponent, {
      autoFocus: false
    });
  }
}
