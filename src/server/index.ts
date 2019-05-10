import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import fireStoreManager from './fireStoreManager';
import { IMessageItem } from '../interfaces/IMessageItem';

let phrases: any = {};

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', 'http://localhost:4600');
  next();
});

app.get('/get-messages', async (req: any, res: any) => {
  const messages = await fireStoreManager.getMessages();
  phrases = await fireStoreManager.getPhrases();
  res.send(messages);
});

wss.on('connection', async (ws: WebSocket) => {
  ws.on('message', async (param: string) => {
    const msg: IMessageItem = JSON.parse(param);
    fireStoreManager.saveMessage(msg);
    await runBotMessage(ws, msg.chatId);
  });
});

async function runBotMessage(ws: any, chatId: any) {
  let phrasesArray = phrases[chatId];
  if (!phrasesArray) {
    phrases = await fireStoreManager.getPhrases();
    phrasesArray = phrases[chatId];
  }
  const text = phrasesArray[Math.floor(Math.random() * phrasesArray.length)].text;
  const createdAt = Date.now();
  const generatedMessage = {
    chatId,
    id: `${Date.now()}`,
    data: {
      text,
      createdAt,
      self: false,
    },
  };
  fireStoreManager.saveMessage(generatedMessage);

  setTimeout(() => {
    ws.send(JSON.stringify(generatedMessage));
  },         Number(parseFloat(`${Math.random() * 5000}`).toFixed(2)));
}

const PORT = process.env.PORT || 8999;

server.listen(PORT, () => {
  console.log(`Server started on port  ${PORT}:)`);
});
