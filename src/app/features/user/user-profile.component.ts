import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../core/store/auth/auth.selectors';
import { AuthActions } from '../../core/store/auth/auth.actions';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-card" *ngIf="user$ | async as user">
        <h2>Профиль пользователя</h2>
        
        <div class="profile-info">
          <div class="info-item">
            <label>Имя пользователя:</label>
            <span>{{ user.username }}</span>
          </div>
          
          <div class="info-item">
            <label>Статус:</label>
            <span [class.online]="user.is_online">
              {{ user.is_online ? 'В сети' : 'Не в сети' }}
            </span>
          </div>
        </div>

        <button class="logout-btn" (click)="logout()">
          Выйти
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  private readonly store = inject(Store);
  user$ = this.store.select(selectAuthUser);

  logout() {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.store.dispatch(AuthActions.logout({ userId: user.id }));
      }
    });
  }
} 