import { createAction, props } from '@ngrx/store';
import { Channel } from '../models/channel.interface';
import { Message } from '../models/message.interface';
import { User } from '../../../core/models/user.interface';

// Channels
export const loadChannels = createAction('[Chat] Load Channels');
export const loadChannelsSuccess = createAction(
  '[Chat] Load Channels Success',
  props<{ channels: Channel[] }>()
);
export const loadChannelsFailure = createAction(
  '[Chat] Load Channels Failure',
  props<{ error: string }>()
);

// Messages
export const loadMessages = createAction(
  '[Chat] Load Messages',
  props<{ channelId: string }>()
);
export const loadMessagesSuccess = createAction(
  '[Chat] Load Messages Success',
  props<{ messages: Message[] }>()
);
export const loadMessagesFailure = createAction(
  '[Chat] Load Messages Failure',
  props<{ error: string }>()
);

export const sendMessage = createAction(
  '[Chat] Send Message',
  props<{ 
    content: string; 
    channelId: string;
    from_user: string;
  }>()
);
export const sendMessageSuccess = createAction(
  '[Chat] Send Message Success',
  props<{ message: Message }>()
);
export const sendMessageFailure = createAction(
  '[Chat] Send Message Failure',
  props<{ error: string }>()
);

// Channels
export const addChannel = createAction(
  '[Chat] Add Channel',
  props<{ name: string }>()
);

export const addChannelSuccess = createAction(
  '[Chat] Add Channel Success',
  props<{ channel: Channel }>()
);

export const addChannelFailure = createAction(
  '[Chat] Add Channel Failure',
  props<{ error: string }>()
);

// Users
export const addUser = createAction(
  '[Chat] Add User',
  props<{ username: string }>()
);

export const addUserSuccess = createAction(
  '[Chat] Add User Success',
  props<{ user: User }>()
);

export const addUserFailure = createAction(
  '[Chat] Add User Failure',
  props<{ error: string }>()
);

// Load Users
export const loadUsers = createAction('[Chat] Load Users');

export const loadUsersSuccess = createAction(
  '[Chat] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[Chat] Load Users Failure',
  props<{ error: string }>()
); 