import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [``]
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
