import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from './list.component';
import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        token: 'mockToken',
        type: 'mockType',
        id: 1,
        username: 'mockUsername',
        firstName: 'John',
        lastName: 'Doe',
        admin: true,
      },
    } as any;

    mockSessionApiService = {
      all: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [MatCardModule, MatIconModule, RouterTestingModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize sessions$ observable', () => {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: 'Session 1',
        description: 'Description 1',
        date: new Date(),
        teacher_id: 1,
        users: [],
      },
      {
        id: 2,
        name: 'Session 2',
        description: 'Description 2',
        date: new Date(),
        teacher_id: 2,
        users: [],
      },
    ];
    mockSessionApiService.all.mockReturnValue(of(mockSessions));

    component.sessions$ = mockSessionApiService.all();

    fixture.detectChanges();

    expect(mockSessionApiService.all).toHaveBeenCalled();
    expect(component.sessions$).toBeDefined();
    component.sessions$.subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
    });
  });

  it('should return user from sessionService', () => {
    expect(component.user).toEqual(mockSessionService.sessionInformation);
  });
});
