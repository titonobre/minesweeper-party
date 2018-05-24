import { Component, OnInit } from '@angular/core';
import { generateRandomString } from '../../utils/utils';

@Component({
  selector: 'msp-home',
  template: `
    <div class="container">
      <div class="header">
      </div>
      <div class="content">
      <span class="footer mat-body-1">open a predefined game</span>
        <button mat-raised-button routerLink="/easy">Easy</button>
        <button mat-raised-button routerLink="/medium">Medium</button>
        <button mat-raised-button routerLink="/hard">Hard</button>
        <button mat-raised-button routerLink="/extreme">Extreme</button>
        <span class="footer mat-body-1">or generate a random game to share with others...</span>
        <button mat-raised-button routerLink="/{{randomGameId}}">Random</button>
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
      align-items: center;
    }

    .content > * {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }

    .footer {
      grid-area: footer;
    }

    .footer,
    .separator {
      display: flex;
      padding: 8px;
      justify-content: center;
      font-size: 0.7em;
    }
  `]
})
export class HomeComponent implements OnInit {

  public randomGameId: string;

  ngOnInit (){
    this.randomGameId = generateRandomString();
  }
}
