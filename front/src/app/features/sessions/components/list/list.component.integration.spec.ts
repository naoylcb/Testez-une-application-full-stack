import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionServiceMock: jest.Mocked<SessionService>;
  let sessionApiServiceMock: jest.Mocked<SessionApiService>;

  const mockSessions: Session[] = [
    { id: 1, name: 'Session 1', description: 'Description 1', date: new Date(), teacher_id: 1, users: [] },
    { id: 2, name: 'Session 2', description: 'Description 2', date: new Date(), teacher_id: 2, users: [] },
  ];

  const mockSessionInformation: SessionInformation = {
    token: 'mockToken',
    type: 'Bearer',
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  beforeEach(async () => {
    sessionServiceMock = {
      sessionInformation: mockSessionInformation,
    } as jest.Mocked<SessionService>;
    sessionApiServiceMock = {
      all: jest.fn().mockReturnValue(of(mockSessions)),
    } as unknown as jest.Mocked<SessionApiService>;

    await TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sessions', () => {
    fixture.detectChanges();
    const sessionElements = fixture.nativeElement.querySelectorAll('.item');
    expect(sessionElements.length).toBe(2);
  });

  it('should display session details', () => {
    fixture.detectChanges();
    const sessionElements = fixture.nativeElement.querySelectorAll('.item');
    expect(sessionElements[0].textContent).toContain('Session 1');
    expect(sessionElements[0].textContent).toContain('Description 1');
    expect(sessionElements[1].textContent).toContain('Session 2');
    expect(sessionElements[1].textContent).toContain('Description 2');
  });

  it('should show create button for admin users', () => {
    sessionServiceMock.sessionInformation = { ...mockSessionInformation, admin: true };
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
    expect(createButton).toBeTruthy();
  });

  it('should not show create button for non-admin users', () => {
    sessionServiceMock.sessionInformation = { ...mockSessionInformation, admin: false };
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
    expect(createButton).toBeFalsy();
  });

  it('should show edit button for admin users', () => {
    sessionServiceMock.sessionInformation = { ...mockSessionInformation, admin: true };
    fixture.detectChanges();
    const editButtons = fixture.nativeElement.querySelectorAll('button[routerLink="update"]');
    expect(editButtons).toBeTruthy();
  });

  it('should not show edit button for non-admin users', () => {
    sessionServiceMock.sessionInformation = { ...mockSessionInformation, admin: false };
    fixture.detectChanges();
    const editButtons = fixture.nativeElement.querySelectorAll('button[routerLink^="update"]');
    expect(editButtons.length).toBe(0);
  });
});