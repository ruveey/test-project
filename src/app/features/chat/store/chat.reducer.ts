import { createReducer, on } from '@ngrx/store';
import { ChatState, initialChatState } from './chat.state';
import * as ChatActions from './chat.actions';

export const chatReducer = createReducer(
  initialChatState,
  
  on(ChatActions.loadChannels, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ChatActions.loadChannelsSuccess, (state, { channels }) => ({
    ...state,
    channels: [...channels],
    loading: false
  })),
  
  on(ChatActions.loadChannelsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(ChatActions.loadMessages, (state, { channelId }) => ({
    ...state,
    currentChannelId: channelId,
    loading: true,
    error: null
  })),
  
  on(ChatActions.loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages,
    loading: false
  })),
  
  on(ChatActions.loadMessagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(ChatActions.sendMessage, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ChatActions.sendMessageSuccess, (state, { message }) => {
    return {
      ...state,
      messages: [...state.messages, message],
      loading: false
    };
  }),
  
  on(ChatActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(ChatActions.addChannelSuccess, (state, { channel }) => ({
    ...state,
    channels: [...state.channels, channel]
  })),

  on(ChatActions.addChannelFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(ChatActions.addUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user]
  })),

  on(ChatActions.addUserFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(ChatActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users
  }))
); 