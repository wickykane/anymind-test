import { initialState } from './reducers';
import * as actions from './actions';
import { reducer } from './reducers';
import { channels } from './constants';
import { ChatMessage } from 'src/app/core/types';

describe('Chat reducer', () => {
  test('should return a new state with GET_USERS', () => {
    const action = actions.getUserList();
    const newState = reducer(initialState, action);
    expect(newState.users).toEqual(action.users);
  });
  test('should return a new state with SELECT_USER', () => {
    const action = actions.selectUser('Sam');
    const newState = reducer(initialState, action);
    expect(newState.selectedUser).toEqual(action.userId);
  });
  test('should return a new state with SELECT_CHANNEL', () => {
    const action = actions.selectChannel(channels[1]);
    const newState = reducer(initialState, action);
    expect(newState.selectedChannel).toEqual(action.channel);
  });

  test('should return a new state with GET_LATEST_MESSAGE_SUCESS', () => {
    const messages: ChatMessage[] = [
      {
        messageId: '1',
        userId: 'Wicky',
        datetime: new Date().toISOString(),
        text: 'Chat message number 1',
      },
      {
        messageId: '2',
        userId: 'Wicky',
        datetime: new Date().toISOString(),
        text: 'Chat message number 2',
        offline: true,
      },
    ];

    const action = actions.getLastestMessageSuccess(messages);
    const newState = reducer(initialState, action);
    expect(newState.messages).toEqual(action.messages);
  });

  test('should return a new state with GET_LATEST_MESSAGE_SUCESS and is load more action', () => {
    const messages: ChatMessage[] = [
      {
        messageId: '1',
        userId: 'Wicky',
        datetime: new Date().toISOString(),
        text: 'Chat message number 1',
      },
      {
        messageId: '2',
        userId: 'Wicky',
        datetime: new Date().toISOString(),
        text: 'Chat message number 2',
      },
    ];

    const action = actions.getLastestMessageSuccess(messages, true);
    const newState = reducer(
      {
        ...initialState,
        messages: [
          {
            messageId: '3',
            userId: 'Wicky',
            datetime: new Date().toISOString(),
            text: 'Chat message number 3',
          },
        ],
      },
      action
    );
    expect(newState.messages.length).toEqual(3);
  });

  test('should return a new state with GET_LATEST_MESSAGE_SUCESS with empty messafe', () => {
    const messages: ChatMessage[] = [];
    const action = actions.getLastestMessageSuccess(messages, true);
    const newState = reducer(initialState, action);
    expect(newState.messages).toEqual(initialState.messages);
  });
});
