import { Component } from '@angular/core';

@Component({
  selector: 'msp-root',
  template: `
    <div class="container">
      <mat-toolbar class="toolbar" color="primary" role="header">
        <a mat-icon-button routerLink="/"><img width="30" src="assets/icons/icon.svg"></a>
        <span>MineSweeper Party</span>
        <span style="flex: 1;"></span>
        <button *ngIf="showShareButton" mat-icon-button (click)="shareCurrentState()" class="share-button" ><img width="30" src="assets/icons/share.svg"></button>
      </mat-toolbar>

      <div class="content">
        <router-outlet ></router-outlet>
      </div>
    </div>
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
export class AppComponent {

  public showShareButton = false;

  constructor() {
    this.showShareButton = !!navigator['share'];
  }

  shareCurrentState(){
    navigator['share']({
      title: document.title,
      text: 'MineSweeper Party',
      url: window.location.href,
    });
  }
}
