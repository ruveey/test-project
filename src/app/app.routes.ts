import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./features/chat/chat.component').then(m => m.ChatComponent)
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./features/user/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
