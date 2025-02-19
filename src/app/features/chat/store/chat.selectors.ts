import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.state';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectChannels = createSelector(
  selectChatState,
  (state: ChatState) => state.channels
);

export const selectMessages = createSelector(
  selectChatState,
  (state: ChatState) => state.messages
);

export const selectUsers = createSelector(
  selectChatState,
  (state: ChatState) => state.users
);

export const selectCurrentChannelId = createSelector(
  selectChatState,
  (state: ChatState) => state.currentChannelId
);

export const selectLoading = createSelector(
  selectChatState,
  (state: ChatState) => state.loading
);

export const selectError = createSelector(
  selectChatState,
  (state: ChatState) => state.error
); 