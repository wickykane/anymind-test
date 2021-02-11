import { Action, createReducer, on } from '@ngrx/store';
import { Channel, ChatMessage, User } from 'src/app/core/types';
import * as actions from './actions';
import { channels } from './constants';

export const featureKey = 'chat';

export interface ChatState {
  users: User[];
  selectedUser: string;
  selectedChannel: Channel;
  messages: ChatMessage[];
  firstMessageId: string;
  lastMessageId: string;
}

export const initialState: ChatState = {
  users: [],
  selectedUser: 'Joyse',
  selectedChannel: channels[0],
  messages: [],
  firstMessageId: '',
  lastMessageId: '',
};

export const chatReducer = createReducer(
  initialState,
  on(actions.getUserList, (state: ChatState, { users }) => ({
    ...state,
    users,
  })),
  on(actions.selectUser, (state: ChatState, { userId }) => ({
    ...state,
    selectedUser: userId,
  })),
  on(actions.selectChannel, (state: ChatState, { channel }) => ({
    ...state,
    selectedChannel: channel,
  })),
  on(
    actions.getLastestMessageSuccess,
    (state: ChatState, { messages, loadMore }) => {
      const newMessages = [
        ...messages,
        ...(loadMore ? state.messages : []),
      ].sort(function (a, b) {
        return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
      });

      const sentMessages = newMessages.filter((msg) => !msg.offline);

      const props = {
        messages: newMessages,
        firstMessageId: sentMessages[0]?.messageId,
        lastMessageId: sentMessages[sentMessages.length - 1]?.messageId,
      };

      return {
        ...state,
        ...props,
      };
    }
  )
);

export function reducer(
  state: ChatState | undefined,
  action: Action
): ChatState {
  return chatReducer(state, action);
}
