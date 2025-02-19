import { User } from '../../../core/models/user.interface';
import { Channel } from '../models/channel.interface';
import { Message } from '../models/message.interface';

export interface ChatState {
  channels: Channel[];
  messages: Message[];
  currentChannelId: string | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialChatState: ChatState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  users: [],
  loading: false,
  error: null
}; 