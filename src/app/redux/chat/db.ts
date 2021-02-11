import Dexie from 'dexie';
import { ChatMessage } from 'src/app/core/types';

export class MessageDatabase extends Dexie {
  public messages: Dexie.Table<ChatMessage, number> | undefined; // id is number in this case

  public constructor() {
    super('MessageDatabase');
    this.version(1).stores({
      messages: '++messageId,userId,text,datetime,offline',
    });
    this.messages = this.table('messages');
  }
}
