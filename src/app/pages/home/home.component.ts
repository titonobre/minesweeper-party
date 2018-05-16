import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'msp-home',
  template: `

  <div class="container centered">
    <div class="content">
      <button mat-button routerLink="/easy">Easy</button>
      <button mat-button routerLink="/medium">Medium</button>
      <button mat-button routerLink="/hard">Hard</button>
      <button mat-button routerLink="/extreme">Extreme</button>
    </div>
  </div>
  `,
  styles: [`
  .container {
    padding: 8px;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 50% 0;
  }

  .content > *:not(:first-child) {
    margin-top: 1em;
  }

  .centered {
    display: flex;
    justify-content: center;
  }

  .fab{
    right: 20px;
    bottom: 20px;
    position: fixed !important;
  }
  `]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
