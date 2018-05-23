import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'msp-root',
  template: `
    <div class="container">
      <mat-toolbar class="toolbar" color="primary" role="header">
        <a mat-icon-button routerLink="/"><img width="30" src="assets/icons/icon.svg"></a>
        <span>MineSweeper Party</span>
        <span style="flex: 1;"></span>
        <span></span>
      </mat-toolbar>

      <div class="content">
        <router-outlet ></router-outlet>
      </div>
    </div>



    <!--<img width="300" src="assets/icons/icon.svg">-->
  `,
  styles: [`

    .container {
      min-height: 100vh;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 0fr 1fr;
      grid-template-areas: 'toolbar' 'content';
    }

    .toolbar {
      grid-area: toolbar;
    }

    .content {
      grid-area: content;
    }
  `]
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
