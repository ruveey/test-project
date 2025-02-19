import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.interface';
import { Message } from '../models/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/chat';

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`);
  }

  getMessages(channelId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/${channelId}`);
  }

  sendMessage(content: string, channelId: string, from_user: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, { 
      content, 
      channelId,
      from_user
    });
  }

  addChannel(name: string): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/channels`, { name });
  }

  addUser(username: string): Observable<{ id: string; username: string; is_online: boolean }> {
    return this.http.post<{ id: string; username: string; is_online: boolean }>(
      `${this.apiUrl}/users`, 
      { username }
    );
  }

  getUsers(): Observable<Array<{ id: string; username: string; is_online: boolean }>> {
    return this.http.get<Array<{ id: string; username: string; is_online: boolean }>>(`${this.apiUrl}/users`);
  }
} 