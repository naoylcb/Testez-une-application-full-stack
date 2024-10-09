import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  Router,
  ParamMap,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        token: 'mockToken',
        type: 'Bearer',
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        admin: true,
      },
    } as any;

    mockSessionApiService = {
      detail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;

    mockTeacherService = {
      all: jest.fn().mockReturnValue(of([])),
    } as any;

    mockRouter = {
      navigate: jest.fn(),
      url: '/create',
    } as any;

    const mockParamMap: ParamMap = {
      get: jest.fn().mockReturnValue('1'),
      has: jest.fn(),
      getAll: jest.fn(),
      keys: [],
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
    };

    mockActivatedRoute = {
      snapshot: mockSnapshot as ActivatedRouteSnapshot,
    };

    mockMatSnackBar = {
      open: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [FormComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form for create', () => {
    Object.defineProperty(mockRouter, 'url', { value: '/create' });
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.onUpdate).toBeFalsy();
    expect(component.sessionForm).toBeDefined();
  });

  it('should initialize form for update', () => {
    Object.defineProperty(mockRouter, 'url', { value: '/update/1' });
    const mockSession: Session = {
      id: 1,
      name: 'Test Session',
      date: new Date('2023-06-15'),
      teacher_id: 1,
      description: 'Test Description',
      users: [],
    };
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.onUpdate).toBeTruthy();
    expect(component.sessionForm).toBeDefined();
  });

  it('should submit form for create', () => {
    component.onUpdate = false;
    component.sessionForm = component['fb'].group({
      name: 'New Session',
      date: '2023-06-16',
      teacher_id: 2,
      description: 'New Description',
    });
    const mockCreatedSession: Session = {
      id: 1,
      name: 'New Session',
      date: new Date('2023-06-16'),
      teacher_id: 2,
      description: 'New Description',
      users: [],
    };
    mockSessionApiService.create.mockReturnValue(of(mockCreatedSession));
    component.submit();
    expect(mockSessionApiService.create).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should submit form for update', () => {
    component.onUpdate = true;
    component['id'] = '1';
    component.sessionForm = component['fb'].group({
      name: 'Updated Session',
      date: '2023-06-17',
      teacher_id: 3,
      description: 'Updated Description',
    });
    const mockUpdatedSession: Session = {
      id: 1,
      name: 'Updated Session',
      date: new Date('2023-06-17'),
      teacher_id: 3,
      description: 'Updated Description',
      users: [],
    };
    mockSessionApiService.update.mockReturnValue(of(mockUpdatedSession));
    component.submit();
    expect(mockSessionApiService.update).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
