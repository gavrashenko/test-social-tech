import { Server } from 'mock-socket';
import WebSocketManager from '@/WebSocketManager';

describe('that chat app can be mocked', () => {

  it('WebSocket reconnect', async() => {
    let isConnected = false;
    let noConection = false;
    const url = 'ws://localhost:8600';
    const whenSocketDisconnect = async () => {
      return new Promise(async (res) => {
        const ws = new WebSocketManager(url);
        ws.on('open', () => {
          if (noConection) {
            isConnected = true;
          }
        });
        ws.on('disconnect', () => {
          noConection = true;
          res();
        });
      });
    };

    const connectingOnServer = async () => {
      return new Promise(async (res) => {
        const mockServer = new Server(url);
        mockServer.on('connection', () => {
          res('connect');
        });
      });
    };
    await whenSocketDisconnect();
    await connectingOnServer();
    expect(isConnected).toBe(true);
  });

  it('WebSocket message sending', async () => {
    const testRes: any = [];

    const whenServerSendMessage = async () => {
      return new Promise(async (res) => {
        const url = 'ws://localhost:8080';
        const mockServer = new Server(url);
        const testData = { test: true };
        mockServer.on('connection', (server) => {
          server.send(JSON.stringify(testData));
        });
        const ws = new WebSocketManager(url);
        ws.on('message', (msg: any) => {
          testRes.push(msg);
          res();
        });
      });
    };

    await whenServerSendMessage();

    expect(testRes[0].test).toBe(true);
  });
});
