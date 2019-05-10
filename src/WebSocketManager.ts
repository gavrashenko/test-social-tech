/// <reference path="../node_modules/@types/ws/index.d.ts" />
import { IMessageItem } from '@/interfaces/IMessageItem';

export default class WebSocketManager {
  private openCb: Function = () => {};
  private messageCb: Function = () => {};
  private errorCb: Function = () => {};
  private closeCb: Function = () => {};
  private disconnectCb: Function = () => {};
  private socket: WebSocket;

  constructor(private url: string) {
    this.socket = new WebSocket(this.url);
    this.init();
  }

  private init(): void {
    this.socket.onopen = (data) => {
      this.openCb(data);
    };
    this.socket.onmessage = (event) => {
      this.messageCb(JSON.parse(event.data));
    };
    this.socket.onerror = (event) => {
      this.errorCb(event);
    };
    this.socket.onclose = (event) => {
      if (!event.wasClean) {
        this.disconnectCb(event);
        setTimeout(() => this.restart(), 500);
      }
      this.closeCb(event);
    };
  }

  private restart(): void {
    this.socket = new WebSocket(this.url);
    this.init();
  }

  on(event: string, callback: Function) {
    switch (event) {
      case 'open':
        this.openCb = callback;
        break;
      case 'message':
        this.messageCb = callback;
        break;
      case 'error':
        this.errorCb = callback;
        break;
      case 'close':
        this.closeCb = callback;
        break;
      case 'disconnect':
        this.disconnectCb = callback;
        break;
    }
  }

  sendMessage(data: IMessageItem): void {
    this.socket.send(JSON.stringify(data));
  }
}
