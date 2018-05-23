import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MinesweeperPartyService } from '../../services/minesweeper-party.service';

import { revealTile, isGameOver, createGame, Tile, Game, setFlag } from '../../../minesweeper';


@Component({
  selector: 'msp-game',
  template: `
    <div class="container">

      <div class="content">
        <msp-minesweeper *ngIf="game" [game]="game" (revealTile)="revealTile($event)" (flagTile)="flagTile($event)"></msp-minesweeper>
      </div>

      <div class="content modal" *ngIf="game && (game.isSafe || game.isDead)">
        <div class="dialog">
          <div class="message mat-body-2" *ngIf="game && game.isSafe">Well done!</div>
          <div class="message mat-body-2" *ngIf="game && game.isDead">BOOM!!1</div>

          <button *ngIf="!game || game.isDead || game.isSafe" mat-raised-button color="primary" (click)="startNewGame()">New Game</button>

          <div class="dialog-footer">
            <button class="footer-button" mat-button routerLink="/">Go Home</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      position: relative;
      max-width: 450px;
      margin: 0 auto;
    }

    .content {
      padding: 8px;
    }

    .modal {
      position: absolute;
      top:0;
      height: 100%;
      width: 100%;
      background-color: rgb(255,255,255,0.9);
    }

    .dialog {
      display:flex;
      align-items:center;
      justify-content: center;
      flex-direction: column;
      padding: 50% 0;
    }

    .message {
      padding: 1em;
      font-size: 2em;
    }

    .dialog-footer {
      padding: 16px;
    }
  `]
})
export class GameComponent implements OnInit, OnChanges, OnDestroy {

  public game: Game;

  private channel: string;

  constructor(
    private route: ActivatedRoute,
    private minesweeperPartyService: MinesweeperPartyService
  ) { }

  ngOnInit() {

    this.route.paramMap
      .subscribe(params => {
        this.channel = params.get('channel');

        this.minesweeperPartyService.getGame(this.channel).subscribe(game => this.setGame(game));

        this.minesweeperPartyService.getUpdates(this.channel).subscribe(update => {
          if (update.reveal) {
            this.game = revealTile(this.game, update.reveal.tile);
          }
          if (update.flag) {
            this.game = setFlag(this.game, update.flag.tile, update.flag.flag);
          }
        });
      });



  }

  ngOnChanges() {

  }

  ngOnDestroy() { }


  startNewGame() {

    this.minesweeperPartyService.getGame(this.channel).subscribe(game => this.setGame(game));
  }

  revealTile(tile: Tile) {

    if (!tile || isGameOver(this.game)) {
      return;
    }

    this.minesweeperPartyService.reveal(this.channel, tile.id);

    this.game = revealTile(this.game, tile.id);

  }

  flagTile(tile: Tile) {

    if (!tile || isGameOver(this.game)) {
      return;
    }

    this.minesweeperPartyService.flag(this.channel, tile.id, !tile.isFlagged);

    this.game = setFlag(this.game, tile.id, !tile.isFlagged);

  }

  setGame(game: Game) {

    this.game = game;

    if (isGameOver(this.game)) {
      console.log('GAME OVER!', this.game);
    }
  }
}
