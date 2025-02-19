import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectChannels, selectMessages, selectUsers } from './store/chat.selectors';
import { selectAuthUser } from '../../core/store/auth/auth.selectors';
import { loadChannels, loadMessages, sendMessage, addChannel, addUser, loadUsers } from './store/chat.actions';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.interface';
import { Channel } from './models/channel.interface';
import { take } from 'rxjs/operators';
import { AuthActions } from '../../core/store/auth/auth.actions';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="chat-container">
      <aside class="sidebar">
        <div class="user-info">
          <div class="current-user">
            <span class="status" [class.online]="currentUser?.is_online"></span>
            <span class="username">{{ currentUser?.username }}</span>
          </div>
          <div class="actions">
            <button class="icon-button" title="Settings">⚙️</button>
            <button class="icon-button" (click)="logout()" title="Logout">↪️</button>
          </div>
        </div>

        <div class="channels-section">
          <h2>CHANNELS</h2>
          <div class="channels-list">
            <div 
              *ngFor="let channel of channels$ | async"
              class="channel"
              [class.active]="channel.id === currentChannelId"
              (click)="selectChannel(channel.id)"
            >
              # {{ channel.name }}
            </div>
          </div>
          <button class="add-channel" (click)="openAddChannelDialog()">+ Add channel</button>
        </div>

        <div class="users-section">
          <h2>USERS</h2>
          <div class="users-list">
            <div class="user" *ngFor="let user of users$ | async">
              <span class="status" [class.online]="user.is_online"></span>
              <span class="user-name">{{ user.name || user.username }}</span>
              <span class="online-status" *ngIf="user.is_online">(online)</span>
            </div>
          </div>
          <button class="add-user" (click)="openAddUserDialog()">+ Add user</button>
        </div>
      </aside>

      <main class="chat-main">
        <div class="channel-header">
          <h2># {{ currentChannel?.name }}</h2>
        </div>

        <div class="messages-container">
          <div 
            *ngFor="let message of messages$ | async"
            class="message"
            [class.own-message]="message.from_user === currentUserId"
          >
            <div class="message-header">
              <span class="username">{{ message.user_name }}</span>
            </div>
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
        </div>

        <div class="message-input">
          <form [formGroup]="messageForm" (ngSubmit)="sendMessage()">
            <input 
              formControlName="message"
              type="text" 
              placeholder="Type a message..."
            >
            <button type="submit">Send</button>
          </form>
        </div>
      </main>
    </div>

    <!-- Диалоги -->
    <div *ngIf="showAddChannelDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>Add New Channel</h3>
        <form [formGroup]="channelForm" (ngSubmit)="addChannel()">
          <div class="form-field">
            <input 
              formControlName="name"
              type="text" 
              placeholder="Channel name"
              [class.error]="channelForm.get('name')?.touched && channelForm.get('name')?.invalid"
            >
            <div class="error-message" *ngIf="channelForm.get('name')?.touched && channelForm.get('name')?.errors?.['required']">
              Channel name is required
            </div>
            <div class="error-message" *ngIf="channelForm.get('name')?.touched && channelForm.get('name')?.errors?.['minlength']">
              Channel name must be at least 3 characters
            </div>
            <div class="error-message" *ngIf="channelForm.get('name')?.touched && channelForm.get('name')?.errors?.['pattern']">
              Channel name cannot be only whitespace
            </div>
          </div>
          <div class="dialog-actions">
            <button type="button" (click)="showAddChannelDialog = false">Cancel</button>
            <button type="submit" [disabled]="channelForm.invalid">Add</button>
          </div>
        </form>
      </div>
    </div>

    <div *ngIf="showAddUserDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>Add New User</h3>
        <form [formGroup]="userForm" (ngSubmit)="addUser()">
          <div class="form-field">
            <input 
              formControlName="username"
              type="text" 
              placeholder="Username"
              [class.error]="userForm.get('username')?.touched && userForm.get('username')?.invalid"
            >
            <div class="error-message" *ngIf="userForm.get('username')?.touched && userForm.get('username')?.errors?.['required']">
              Username is required
            </div>
            <div class="error-message" *ngIf="userForm.get('username')?.touched && userForm.get('username')?.errors?.['minlength']">
              Username must be at least 3 characters
            </div>
          </div>
          <div class="dialog-actions">
            <button type="button" (click)="showAddUserDialog = false">Cancel</button>
            <button type="submit" [disabled]="userForm.invalid">Add</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  channels$ = this.store.select(selectChannels);
  messages$ = this.store.select(selectMessages);
  users$ = this.store.select(selectUsers);
  messageForm = this.fb.group({
    message: ['']
  });
  currentChannelId = '';
  currentUserId = '';
  currentUser: User | null = null;
  currentChannel?: Channel;

  showAddChannelDialog = false;
  showAddUserDialog = false;

  channelForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^(?!\s*$).+/)
    ]]
  });

  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit() {
    this.store.select(selectAuthUser).subscribe(user => {
      this.currentUser = user;
      this.currentUserId = user?.id || '';
    });

    this.store.dispatch(loadChannels());
    this.store.dispatch(loadUsers());
    this.selectChannel('1');
  }

  selectChannel(channelId: string) {
    this.currentChannelId = channelId;
    this.channels$.pipe(take(1)).subscribe(channels => {
      this.currentChannel = channels.find(c => c.id === channelId);
    });
    this.store.dispatch(loadMessages({ channelId }));
  }

  sendMessage() {
    if (this.messageForm.valid && this.currentChannelId) {
      const content = this.messageForm.value.message?.trim();
      if (content) {
        this.store.dispatch(sendMessage({ 
          content, 
          channelId: this.currentChannelId,
          from_user: this.currentUserId
        }));
        this.messageForm.reset();
      }
    }
  }

  logout() {
    if (this.currentUserId) {
      this.store.dispatch(AuthActions.logout({ userId: this.currentUserId }));
    }
    this.router.navigate(['/login']);
  }

  openAddChannelDialog() {
    this.showAddChannelDialog = true;
    this.channelForm.reset();
  }

  openAddUserDialog() {
    this.showAddUserDialog = true;
    this.userForm.reset();
  }

  addChannel() {
    if (this.channelForm.valid) {
      const name = this.channelForm.value.name?.trim();
      if (name && name.length >= 3) {
        this.store.dispatch(addChannel({ name }));
        this.showAddChannelDialog = false;
        this.channelForm.reset();
        
        this.channels$.pipe(take(1)).subscribe(channels => {
          const newChannel = channels[channels.length - 1];
          if (newChannel) {
            this.selectChannel(newChannel.id);
          }
        });
      } else {
        this.channelForm.get('name')?.setErrors({ minlength: true });
        this.channelForm.markAllAsTouched();
      }
    } else {
      this.channelForm.markAllAsTouched();
    }
  }

  addUser() {
    if (this.userForm.valid) {
      const username = this.userForm.value.username?.trim();
      if (username) {
        this.store.dispatch(addUser({ username }));
        this.showAddUserDialog = false;
        this.userForm.reset();
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }
} 