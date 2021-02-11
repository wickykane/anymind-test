import { Channel, ChatMessage } from '../../core/types';
import { createAction } from '@ngrx/store';
import { users } from './constants';

export enum ActionTypes {
  GET_LATEST_MESSAGE = 'app/chat/GET_LATEST_MESSAGE',
  GET_LATEST_MESSAGE_SUCESS = 'app/chat/GET_LATEST_MESSAGE_SUCESS',
  GET_LATEST_MESSAGE_FAILD = 'app/chat/GET_LATEST_MESSAGE_FAILD',
  GET_OLDER_MESSAGE = 'app/chat/GET_OLDER_MESSAGE',
  SEND_MESSAGE = 'app/chat/SEND_MESSAGE',
  SEND_MESSAGE_SUCCESS = 'app/chat/SEND_MESSAGE_SUCCESS',
  SEND_MESSAGE_FAILED = 'app/chat/SEND_MESSAGE_FAILED',
  GET_USERS = 'app/chat/GET_USERS',
  SELECT_USER = 'app/chat/SELECT_USER',
  SELECT_CHANNEL = 'app/chat/SELECT_CHANNEL',
}

export const getUserList = createAction(ActionTypes.GET_USERS, () => {
  return { users };
});

export const getLastestMessage = createAction(ActionTypes.GET_LATEST_MESSAGE);

export const getLastestMessageSuccess = createAction(
  ActionTypes.GET_LATEST_MESSAGE_SUCESS,
  (messages: ChatMessage[], loadMore?: boolean) => {
    return {
      messages,
      loadMore,
    };
  }
);

export const getLastestMessageFailed = createAction(
  ActionTypes.GET_LATEST_MESSAGE_FAILD
);

export const selectUser = createAction(
  ActionTypes.SELECT_USER,
  (userId: string) => {
    return { userId };
  }
);

export const selectChannel = createAction(
  ActionTypes.SELECT_CHANNEL,
  (channel: Channel) => {
    return { channel };
  }
);

export const sendMessage = createAction(
  ActionTypes.SEND_MESSAGE,
  (message: string) => {
    return { message };
  }
);

export const fetchMoreMessage = createAction(
  ActionTypes.GET_OLDER_MESSAGE,
  (old: boolean) => {
    return { old };
  }
);
