import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'msp-root',
  template: `
    <mat-toolbar color="primary" role="header">
      <a mat-icon-button routerLink="/"><img width="30" src="assets/icons/icon.svg"></a>
      <span>MineSweeper Party</span>
      <span style="flex: 1;"></span>
      <span></span>
    </mat-toolbar>

    <div class="page-container">
      <router-outlet ></router-outlet>
    </div>

    <div class="footer mat-body-1">
      <span>
        Do you speak code? See how this was made on <a href="https://github.com/titonobre/minesweeper-party">GitHub</a>
      </span>
    </div>

    <!--<img width="300" src="assets/icons/icon.svg">-->
  `,
  styles: [`

    .toolbar {
      width: 100%;
    }

    .page-container {
      min-height: calc(100vh - 56px);
    }

    .footer {
      display: flex;
      padding: 8px;
      justify-content: center
    }

    `]
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
