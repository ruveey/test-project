export interface Message {
  id: string;
  from_user: string;
  user_name?: string;
  channel_id: string;
  content: string;
} 