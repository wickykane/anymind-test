import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChat from './reducers';

export const selectChatState = createFeatureSelector<fromChat.ChatState>(
  fromChat.featureKey
);

export const selectUsers = createSelector(
  selectChatState,

  (state: fromChat.ChatState) => state.users
);

export const selectSelectedUser = createSelector(
  selectChatState,

  (state: fromChat.ChatState) => state.selectedUser
);

export const selectSelectedChannel = createSelector(
  selectChatState,

  (state: fromChat.ChatState) => state.selectedChannel
);

export const selectMessages = createSelector(
  selectChatState,

  (state: fromChat.ChatState) => state.messages
);

export const selectFirstMessageId = createSelector(
  selectChatState,

  (state: fromChat.ChatState) => state.firstMessageId
);

export const selectLastMessageId = createSelector(
  selectChatState,

  (state: fromChat.ChatState) => state.lastMessageId
);
