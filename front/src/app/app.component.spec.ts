import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockSessionService: jest.Mocked<SessionService>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
      routerState: {
        root: {}
      }
    } as any;
    mockAuthService = {} as any;
    mockSessionService = {
      $isLogged: jest.fn().mockReturnValue(of(true)),
      logOut: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatToolbarModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should check if user is logged in', (done) => {
    component.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true);
      expect(mockSessionService.$isLogged).toHaveBeenCalled();
      done();
    });
  });

  it('should log out the user', () => {
    component.logout();
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
