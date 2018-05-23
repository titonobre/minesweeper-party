import { Component } from '@angular/core';

@Component({
  selector: 'msp-home',
  template: `
    <div class="container">
      <div class="header">
      </div>
      <div class="content">
        <button mat-button routerLink="/easy">Easy</button>
        <button mat-button routerLink="/medium">Medium</button>
        <button mat-button routerLink="/hard">Hard</button>
        <button mat-button routerLink="/extreme">Extreme</button>
      </div>
      <div class="footer mat-body-1">
        <span>
          Do you speak code? See how this was made on <a href="https://github.com/titonobre/minesweeper-party">GitHub</a>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .container {
      width: 100%;
      height: 100%;
      padding: 8px;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 0fr 1fr 0fr;
      grid-template-areas: 'header' 'content' 'footer';
    }

    .header {
      grid-area: header;
    }

    .content {
      grid-area: content;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .content > *:not(:first-child) {
      margin-top: 1em;
    }

    .footer {
      grid-area: footer;
      display: flex;
      padding: 8px;
      justify-content: center;
      font-size: 0.7em;
    }
  `]
})
export class HomeComponent { }
