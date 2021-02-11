export interface Channel {
  id: string;
  name: string;
}

export interface ChatMessage {
  messageId: string;
  text: string;
  datetime: string;
  userId: string;
  offline?: boolean;
}

export interface User {
  userId: string;
  avatar?: string;
}

export interface MessagesResponse extends Object {
  fetchLatestMessages: ChatMessage[];
}

export interface FetchMoreMessagesResponse extends Object {
  fetchMoreMessages: ChatMessage[];
}

export interface PostMessageResponse extends Object {
  postMessage: ChatMessage;
}
