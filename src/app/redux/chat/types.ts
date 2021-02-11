import { Channel, ChatMessage } from 'src/app/core/types';

export interface LatestMessagesPayload {
  messages: ChatMessage[];
  loadMore?: boolean;
}

export interface LoadMorePayload {
  old: boolean;
}

export interface ChangeChannelPayload {
  channel: Channel;
}
