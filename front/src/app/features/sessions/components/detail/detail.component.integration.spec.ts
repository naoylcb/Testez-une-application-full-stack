import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailComponent (Integration)', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockRouter: jest.Mocked<Router>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;

  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    description: 'Test Description',
    date: new Date('2023-05-01'),
    teacher_id: 1,
    users: [1],
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-04-15')
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        admin: true,
        id: 1
      }
    } as any;

    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of(undefined)),
      participate: jest.fn().mockReturnValue(of(undefined)),
      unParticipate: jest.fn().mockReturnValue(of(undefined))
    } as any;

    mockTeacherService = {
      detail: jest.fn().mockReturnValue(of(mockTeacher))
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockMatSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and display session details', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);

    const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(titleElement.textContent).toBe('Test Session');

    const descriptionElement = fixture.debugElement.query(By.css('.description')).nativeElement;
    expect(descriptionElement.textContent).toContain('Test Description');

    const teacherElement = fixture.debugElement.query(By.css('mat-card-subtitle')).nativeElement;
    expect(teacherElement.textContent).toContain('John DOE');
  }));

  it('should show delete button for admin', () => {
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.nativeElement.textContent).toContain('Delete');
  });

  it('should show participate button for non-admin when not participating', fakeAsync(() => {
    component.isAdmin = false;
    component.isParticipate = false;
    fixture.detectChanges();
    tick();

    const participateButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    expect(participateButton).toBeTruthy();
    expect(participateButton.nativeElement.textContent).toContain('Participate');
  }));

  it('should show unparticipate button for non-admin when participating', fakeAsync(() => {
    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();
    tick();

    const unparticipateButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(unparticipateButton).toBeTruthy();
    expect(unparticipateButton.nativeElement.textContent).toContain('Do not participate');
  }));

  it('should delete session when delete button is clicked', fakeAsync(() => {
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    deleteButton.triggerEventHandler('click', null);
    tick();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  }));

  it('should participate when participate button is clicked', fakeAsync(() => {
    component.isAdmin = false;
    component.isParticipate = false;
    fixture.detectChanges();
    tick();

    const participateButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    participateButton.triggerEventHandler('click', null);
    tick();

    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalledTimes(2); // Initial call + after participate
  }));

  it('should unparticipate when unparticipate button is clicked', fakeAsync(() => {
    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();
    tick();

    const unparticipateButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    unparticipateButton.triggerEventHandler('click', null);
    tick();

    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalledTimes(2); // Initial call + after unparticipate
  }));
});