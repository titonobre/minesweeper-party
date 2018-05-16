import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Tile } from '../../minesweeper';

const colors = {
  1: '#4CAF50',
  2: '#95C647',
  3: '#DDB240',
  4: '#F44336',
  5: '#E4398C',
  6: '#CE3CD4',
  7: '#743EC4',
  8: '#3F51B5',
}

@Component({
  selector: 'msp-tile',
  template: `
    <div class="tile" [class.mine]="tile.isMine" [class.revealed]="tile.isRevealed"
      (click)="handleClick()"
      (mousedown)="handleDown()"
      (mouseup)="handleUp()"
      (mouseleave)="handleUp()"
      (touchstart)="handleDown()"
      (touchend)="handleUp()"
      (touchmove)="handleUp()"
      >
      <span *ngIf="tile.isRevealed && !tile.isMine && tile.threatCount > 0" [style.color]="color">{{ tile.threatCount }}</span>
      <span *ngIf="tile.isRevealed && tile.isMine">💥</span>
      <span *ngIf="!tile.isRevealed && tile.isFlagged">🚩</span>
    </div>
  `,
  styles: [`
    .tile {
      width: 100%;
      height: 100%;
      color: #212121;
      font-weight: bold;

      display: flex;
      align-items: center;
      justify-content: center;

      background: #9E9E9E ;

      border-radius: 2px;

      font-size: 20px;

      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    }

    .revealed {
      background: #FAFAFA;
    }

    .mine.revealed {
      /* background: url(../images/danger.png); */
      // background: #F44336;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent implements OnChanges {
  @Input() tile: Tile;
  @Output() reveal: EventEmitter<Tile> = new EventEmitter();
  @Output() flag: EventEmitter<Tile> = new EventEmitter();

  public color: string;

  private pressTimer;

  private lastEventWasHold: boolean;

  ngOnChanges(){
    this.color = colors[this.tile.threatCount];
  }

  handleClick() {
    if (!this.lastEventWasHold && !this.tile.isFlagged) {
      this.reveal.next(this.tile);
    }
  }

  handleDblClick($event: MouseEvent){

    if($event){
      $event.stopImmediatePropagation();
      $event.preventDefault();
    }

    this.flag.next(this.tile);
  }

  handleDown() {
    this.lastEventWasHold = false;

    this.pressTimer = setTimeout(() => {
      this.lastEventWasHold = true;
      this.handleDblClick(null);
    }, 750);
  }

  handleUp() {
    clearTimeout(this.pressTimer);
  }
}
