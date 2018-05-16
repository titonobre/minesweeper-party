import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import Pusher from 'pusher-js';

import { environment } from '../../environments/environment';

import { Game } from '../../minesweeper';

const APP_KEY = '3f08615095d5885d5c98';
const APP_CLUSTER = 'eu';

@Injectable({
  providedIn: 'root'
})
export class MinesweeperPartyService {

  private socket: Pusher;

  constructor(private http: HttpClient) {
    this.socket = new Pusher(environment.pusherAppKey, {
      cluster: environment.pusherCluster,
      encrypted: true
    });
  }

  public getGame(channelName: string): Observable<Game> {
    return this.http.get<Game>(`${environment.mspApiUrl}/game/${channelName}`);
  }

  public getUpdates(channelName: string): Observable<any> {
    return new Observable(observer => {
      const channel = this.socket.subscribe(channelName);

      const handler1 = channel.bind('reveal', (reveal) => {
        observer.next({ reveal });
      });

      const handler2 = channel.bind('flag', (flag) => {
        observer.next({ flag });
      });

      return () => {
        channel.unbind('reveal', handler1);
        channel.unbind('flag', handler2);
      };
    });
  }

  public reveal(channelName: string, tile: number) {
    this.http.post(`${environment.mspApiUrl}/game/${channelName}/reveal`, { tile }).subscribe(response => { });
  }

  public flag(channelName: string, tile: number, flag: boolean) {
    this.http.post(`${environment.mspApiUrl}/game/${channelName}/flag`, { tile, flag }).subscribe(response => { });
  }
}
