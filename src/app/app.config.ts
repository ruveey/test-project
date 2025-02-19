import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { ApiInterceptor } from './core/services/api.interceptor';
import { authReducer } from './core/store/auth/auth.reducer';
import { chatReducer } from './features/chat/store/chat.reducer';
import { AuthEffects } from './core/store/auth/auth.effects';
import { ChatEffects } from './features/chat/store/chat.effects';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore({
      auth: authReducer,
      chat: chatReducer
    }),
    provideEffects([AuthEffects, ChatEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    provideAnimations()
  ]
};
