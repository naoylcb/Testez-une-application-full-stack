import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let sessionServiceMock: jest.Mocked<SessionService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    } as any;
    sessionServiceMock = {
      logIn: jest.fn(),
    } as any;
    routerMock = {
      navigate: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should mark form as valid when filled correctly', () => {
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should call authService.login and handle successful login', () => {
    const mockSessionInfo: SessionInformation = {
      token: 'mockToken',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false,
    };
    authServiceMock.login.mockReturnValue(of(mockSessionInfo));

    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    component.submit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(mockSessionInfo);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should handle login error', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => new Error('Login failed'))
    );

    component.form.setValue({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    component.submit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  });
});
