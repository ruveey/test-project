export interface Channel {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  from_user: string;
  channel_id: string;
  content: string;
} 