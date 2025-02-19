import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    exhaustMap(({ credentials }) =>
      this.authService.login(credentials).pipe(
        map(user => AuthActions.loginSuccess({ user })),
        catchError(error => of(AuthActions.loginFailure({ 
          error: error.message || 'Ошибка авторизации' 
        })))
      )
    )
  ));

  loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(() => this.router.navigate(['/chat']))
  ), { dispatch: false });

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    exhaustMap(({ userId }) => this.authService.logout(userId)
      .pipe(
        map(() => AuthActions.logoutSuccess()),
        catchError(error => of(AuthActions.logoutFailure({ error: error.message })))
      ))
  ));
} 