import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserCredentials } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: UserCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('token', 'fake-jwt-token');
      })
    );
  }

  logout(userId: string): Observable<any> {
    return this.http.post('/api/auth/logout', { userId });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
} 