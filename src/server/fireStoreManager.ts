/* eslint-disable no-restricted-syntax,no-await-in-loop */
import 'firebase/firestore';
import * as admin from 'firebase-admin';
import IMessageItem from '../interfaces/IMessageItem';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://test-social-tech.firebaseio.com',
});

const db = admin.firestore();

export default {
  async getPhrases() {
    const phrasesMap: any = {};
    const collectionRef = db.collection('chats');
    const chatsCollection = await collectionRef.get();
    const chatsCollectionArray: any = [];
    chatsCollection.forEach(async (collItem: any) => {
      chatsCollectionArray.push({
        id: collItem.id,
        data: collItem.data(),
      });
    });
    for (const collectionItem of chatsCollectionArray) {
      const phrasesCollection = await collectionRef
        .doc(collectionItem.id).collection('phrases').get();
      const phrases: {text: string}[] = [];
      phrasesCollection.forEach(async (collItem: any) => {
        phrases.push(collItem.data());
      });
      phrasesMap[collectionItem.id] = phrases;
    }
    return phrasesMap;
  },
  async getMessages() {
    const collectionRef = db.collection('chats');
    const chatsCollection = await collectionRef.get();
    const chatsCollectionArray: any = [];
    chatsCollection.forEach(async (collItem: any) => {
      chatsCollectionArray.push({
        id: collItem.id,
        data: collItem.data(),
      });
    });
    for (const collectionItem of chatsCollectionArray) {
      const chatMessagesCollection = await collectionRef
        .doc(collectionItem.id).collection('messages')
        .orderBy('createdAt').get();
      const chatMessages: any[] = [];
      chatMessagesCollection.forEach(async (collItem: any) => {
        chatMessages.push({
          id: collItem.id,
          data: collItem.data(),
        });
      });
      collectionItem.messages = chatMessages;
    }
    return chatsCollectionArray;
  },
  saveMessage(param: IMessageItem) {
    db.collection('chats').doc(param.chatId).collection('messages').add({
      text: param.data.text,
      createdAt: param.data.createdAt,
      self: param.data.self,
    });
  },
};
