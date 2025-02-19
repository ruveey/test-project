import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../../core/store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../core/store/auth/auth.selectors';
import { UserCredentials } from '../../../core/models/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input 
            id="username" 
            type="text" 
            formControlName="username"
            [class.error]="isFieldInvalid('username')"
          >
          <div class="error-message" *ngIf="isFieldInvalid('username')">
            Введите имя пользователя
          </div>
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password"
            [class.error]="isFieldInvalid('password')"
          >
          <div class="error-message" *ngIf="isFieldInvalid('password')">
            Введите пароль
          </div>
        </div>

        <div class="auth-error" *ngIf="error$ | async as error">
          <span class="error-icon">⚠️</span>
          <span>Проверьте правильность введенных данных</span>
        </div>

        <button type="submit" [disabled]="loginForm.invalid || (loading$ | async)">
          {{ (loading$ | async) ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  error$ = this.store.select(selectAuthError);
  loading$ = this.store.select(selectAuthLoading);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: UserCredentials = this.loginForm.value as UserCredentials;
      this.store.dispatch(login({ credentials }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && field.touched;
  }
} 