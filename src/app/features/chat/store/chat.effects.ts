import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom } from 'rxjs/operators';
import * as ChatActions from './chat.actions';
import { ChatService } from '../services/chat.service';

@Injectable()
export class ChatEffects {
  private readonly actions$ = inject(Actions);
  private readonly chatService = inject(ChatService);
  private readonly store = inject(Store);

  loadChannels$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.loadChannels),
    exhaustMap(() => this.chatService.getChannels()
      .pipe(
        map(channels => ChatActions.loadChannelsSuccess({ channels })),
        catchError(error => of(ChatActions.loadChannelsFailure({ error: error.message })))
      ))
  ));

  loadMessages$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.loadMessages),
    exhaustMap(({ channelId }) => this.chatService.getMessages(channelId)
      .pipe(
        map(messages => ChatActions.loadMessagesSuccess({ messages })),
        catchError(error => of(ChatActions.loadMessagesFailure({ error: error.message })))
      ))
  ));

  sendMessage$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.sendMessage),
    exhaustMap(({ content, channelId, from_user }) => 
      this.chatService.sendMessage(content, channelId, from_user)
        .pipe(
          map(message => ChatActions.sendMessageSuccess({ message })),
          catchError(error => of(ChatActions.sendMessageFailure({ error: error.message })))
        )
    )
  ));

  addChannel$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.addChannel),
    exhaustMap(({ name }) => this.chatService.addChannel(name)
      .pipe(
        map(channel => ChatActions.addChannelSuccess({ channel })),
        catchError(error => of(ChatActions.addChannelFailure({ error: error.message })))
      ))
  ));

  addUser$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.addUser),
    exhaustMap(({ username }) => this.chatService.addUser(username)
      .pipe(
        map(user => ChatActions.addUserSuccess({ user })),
        catchError(error => of(ChatActions.addUserFailure({ error: error.message })))
      ))
  ));

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.loadUsers),
    exhaustMap(() => this.chatService.getUsers()
      .pipe(
        map(users => ChatActions.loadUsersSuccess({ users })),
        catchError(error => of(ChatActions.loadUsersFailure({ error: error.message })))
      ))
  ));
} 