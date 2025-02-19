import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private fakeUsers = [
    { 
      id: '1', 
      username: 'test', 
      name: 'Anton',
      password: 'test', 
      is_online: false
    },
    { 
      id: '2', 
      username: 'test2', 
      name: 'Maria',
      password: 'test2', 
      is_online: false 
    }
  ];

  private fakeChannels = [
    { id: '1', name: 'general' },
    { id: '2', name: 'random' }
  ];

  private fakeMessages = [
    { 
      id: '1', 
      from_user: '1', 
      user_name: 'test',
      channel_id: '1', 
      content: 'Привет всем!' 
    },
    { 
      id: '2', 
      from_user: '1', 
      user_name: 'test',
      channel_id: '1', 
      content: 'Как дела?' 
    }
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url === '/api/auth/login') {
      return this.handleLogin(request.body);
    }

    if (request.url === '/api/chat/channels' && request.method === 'GET') {
      return of(new HttpResponse({ 
        status: 200, 
        body: [...this.fakeChannels]
      })).pipe(delay(500));
    }

    if (request.url === '/api/chat/channels' && request.method === 'POST') {
      const lastId = Math.max(...this.fakeChannels.map(ch => Number(ch.id)), 0);
      
      const newChannel = {
        id: (lastId + 1).toString(),
        name: request.body.name
      };
      
      this.fakeChannels = [
        ...this.fakeChannels,
        newChannel
      ];
      
      return of(new HttpResponse({ 
        status: 200, 
        body: { ...newChannel }
      })).pipe(delay(500));
    }

    if (request.url === '/api/chat/messages' && request.method === 'POST') {
      const userId = request.body.from_user;
      const sender = this.fakeUsers.find(u => u.id === userId);
      
      if (!sender) {
        return throwError(() => new Error('User not found')).pipe(delay(500));
      }
      
      const newMessage = {
        id: (this.fakeMessages.length + 1).toString(),
        from_user: userId,
        user_name: sender.username,
        channel_id: request.body.channelId,
        content: request.body.content
      };
      
      this.fakeMessages.push(newMessage);
      
      return of(new HttpResponse({ 
        status: 200, 
        body: newMessage 
      })).pipe(delay(500));
    }

    if (request.url.includes('/api/chat/messages') && request.method === 'GET') {
      const channelId = request.url.split('/').pop();
      const messages = this.fakeMessages
        .filter(m => m.channel_id === channelId)
        .map(message => {
          if (message.user_name) {
            return message;
          }
          const user = this.fakeUsers.find(u => u.id === message.from_user);
          return {
            ...message,
            user_name: user?.username || 'Unknown'
          };
        });
      return of(new HttpResponse({ 
        status: 200, 
        body: messages 
      })).pipe(delay(500));
    }

    if (request.url === '/api/chat/users' && request.method === 'GET') {
      const usersWithoutPasswords = this.fakeUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      return of(new HttpResponse({ 
        status: 200, 
        body: usersWithoutPasswords
      })).pipe(delay(500));
    }

    if (request.url === '/api/chat/users' && request.method === 'POST') {
      const newUser = {
        id: (this.fakeUsers.length + 1).toString(),
        username: request.body.username,
        name: request.body.username,
        password: 'default123',
        is_online: true
      };
      this.fakeUsers.push(newUser);
      
      const { password, ...userWithoutPassword } = newUser;
      return of(new HttpResponse({ 
        status: 200, 
        body: userWithoutPassword 
      })).pipe(delay(500));
    }

    if (request.url === '/api/auth/logout') {
      const userId = request.body.userId;
      this.updateUserStatus(userId, false);
      
      return of(new HttpResponse({ 
        status: 200, 
        body: { success: true } 
      })).pipe(delay(500));
    }
    
    return next.handle(request);
  }

  private updateUserStatus(userId: string, isOnline: boolean) {
    const userIndex = this.fakeUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.fakeUsers[userIndex] = {
        ...this.fakeUsers[userIndex],
        is_online: isOnline
      };
    }
  }

  private handleLogin(credentials: { username: string; password: string }): Observable<any> {
    const userIndex = this.fakeUsers.findIndex(u => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (userIndex !== -1) {
      this.updateUserStatus(this.fakeUsers[userIndex].id, true);
      const { password, ...userWithoutPassword } = this.fakeUsers[userIndex];
      return of(new HttpResponse({ 
        status: 200, 
        body: userWithoutPassword 
      })).pipe(delay(500));
    }

    return throwError(() => new Error('Неверное имя пользователя или пароль')).pipe(delay(500));
  }
} 