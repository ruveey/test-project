import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation errors when form is invalid', () => {
    const form = component.loginForm;
    form.controls['username'].setValue('');
    form.controls['username'].markAsTouched();
    
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Введите имя пользователя');
  });

  it('should call login service and navigate on successful login', () => {
    const credentials = { username: 'test', password: 'test' };
    authService.login.and.returnValue(of({ id: '1', username: 'test', is_online: true }));

    component.loginForm.setValue(credentials);
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(credentials);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle login error', () => {
    const credentials = { username: 'wrong', password: 'wrong' };
    authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));
    
    spyOn(console, 'error');
    
    component.loginForm.setValue(credentials);
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(credentials);
    expect(console.error).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
}); 