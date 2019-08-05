import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: SocketIOClient.Socket;

  connect(): SocketIOClient.Socket {
    this.socket = io(environment.BASE_URL);
    return this.socket;
  }
}
