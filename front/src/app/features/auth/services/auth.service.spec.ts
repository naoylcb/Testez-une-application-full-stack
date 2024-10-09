import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('Register a new user', () => {
      const mockRegisterRequest: RegisterRequest = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      service.register(mockRegisterRequest).subscribe();

      const req = httpMock.expectOne('api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRegisterRequest);
      req.flush(null);
    });
  });

  describe('login', () => {
    it('Login an user', () => {
      const mockLoginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockSessionInfo: SessionInformation = {
        token: 'mockToken',
        type: 'Bearer',
        id: 1,
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
      };

      service.login(mockLoginRequest).subscribe(response => {
        expect(response).toEqual(mockSessionInfo);
      });

      const req = httpMock.expectOne('api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);
      req.flush(mockSessionInfo);
    });
  });
});
