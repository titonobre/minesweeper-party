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
      forceTLS: true
    });
  }

  public getGame(channelName: string): Observable<Game> {
    return this.http.get<Game>(`${environment.mspApiUrl}/game/${channelName}`);
  }

  public getUpdates(channelName: string): Observable<any> {
    return new Observable(observer => {
      const channel = this.socket.subscribe(channelName);

      const revealHandler: Function = (reveal) => {
        observer.next({ reveal });
      };

      const flagHandler: Function = (flag) => {
        observer.next({ flag });
      };

      channel.bind('reveal', revealHandler);
      channel.bind('flag', flagHandler);

      return () => {
        channel.unbind('reveal', revealHandler);
        channel.unbind('flag', flagHandler);
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
