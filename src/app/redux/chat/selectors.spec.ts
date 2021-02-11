import { ChatMessage } from 'src/app/core/types';
import { channels, users } from './constants';
import { ChatState } from './reducers';
import {
  selectChatState,
  selectFirstMessageId,
  selectLastMessageId,
  selectMessages,
  selectSelectedChannel,
  selectSelectedUser,
  selectUsers,
} from './selectors';

describe('Chat Selector', () => {
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

  const chatState: ChatState = {
    messages,
    selectedUser: 'Wicky',
    selectedChannel: channels[0],
    users,
    firstMessageId: '1',
    lastMessageId: '2',
  };

  const state = {
    chat: chatState,
  };

  test('should return chat state', () => {
    expect(selectChatState(state)).toEqual(chatState);
  });

  test('should return users', () => {
    expect(selectUsers(state)).toEqual(chatState.users);
  });

  test('should return selected user', () => {
    expect(selectSelectedUser(state)).toEqual(chatState.selectedUser);
  });

  test('should return selected channel', () => {
    expect(selectSelectedChannel(state)).toEqual(chatState.selectedChannel);
  });

  test('should return messages', () => {
    expect(selectMessages(state)).toEqual(chatState.messages);
  });

  test('should return first id', () => {
    expect(selectFirstMessageId(state)).toEqual(chatState.firstMessageId);
  });

  test('should return last id', () => {
    expect(selectLastMessageId(state)).toEqual(chatState.lastMessageId);
  });
});
