import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, ParamMap, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockRouter: jest.Mocked<Router>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        admin: true,
        id: 1
      }
    } as any;

    mockSessionApiService = {
      detail: jest.fn(),
      delete: jest.fn(),
      participate: jest.fn(),
      unParticipate: jest.fn()
    } as any;

    mockTeacherService = {
      detail: jest.fn()
    } as any;

    const mockParamMap: ParamMap = {
      get: jest.fn().mockReturnValue('1'),
      has: jest.fn(),
      getAll: jest.fn(),
      keys: []
    };

    const mockSnapshot: Partial<ActivatedRouteSnapshot> = {
      paramMap: mockParamMap,
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: {},
      outlet: '',
      component: null,
      routeConfig: null,
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      queryParamMap: {} as ParamMap
    };

    mockActivatedRoute = {
      snapshot: mockSnapshot as ActivatedRouteSnapshot
    };

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockMatSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatCardModule, MatIconModule],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session details on init', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Test Session',
      description: 'Test Description',
      date: new Date(),
      teacher_id: 1,
      users: [1]
    };
    const mockTeacher: Teacher = {
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    fixture.detectChanges();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(mockTeacherService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
    expect(component.isParticipate).toBe(true);
  });

  it('should handle back navigation', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete session', () => {
    mockSessionApiService.delete.mockReturnValue(of(undefined));
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should handle participate', () => {
    mockSessionApiService.participate.mockReturnValue(of(undefined));
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  it('should handle unParticipate', () => {
    mockSessionApiService.unParticipate.mockReturnValue(of(undefined));
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });
});
