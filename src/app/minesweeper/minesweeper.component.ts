import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Tile } from '../../minesweeper';

@Component({
  selector: 'msp-minesweeper',
  template: `
    <div class="board">
      <div class="square" *ngFor="let tile of tiles">
        <div class="square-content tile-container">
          <msp-tile [tile]="tile" (reveal)="handleTileClick($event)" (flag)="handleTileFlag($event)"></msp-tile>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .board {
      display: flex;
      flex-wrap:wrap;
    }

    .square {
      position: relative;
      // width: 50%;

      display: inline-block;
      flex-grow: 1;

      box-sizing: border-box;
        // border: 1px solid grey;
      width: calc(100% * (1/10))
    }

    .square:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }

    .square-content {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .tile-container {
      padding: 2px;
    }
  `],

  // If we enable this, the undo action does not update UI
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinesweeperComponent implements OnChanges {
  @Input() game: any;
  @Output() revealTile: EventEmitter<Tile> = new EventEmitter();
  @Output() flagTile: EventEmitter<Tile> = new EventEmitter();

  tiles: any[];

  ngOnChanges(changes: SimpleChanges) {
    this.tiles = this.game && this.game.tiles;
  }

  handleTileClick(tile: Tile) {
    this.revealTile.next(tile);
  }

  handleTileFlag(tile: Tile) {
    this.flagTile.next(tile);
  }
}
