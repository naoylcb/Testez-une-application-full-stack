import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { MeComponent } from './me.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('MeComponent (Integration)', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;
  let mockUserService: jest.Mocked<UserService>;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'password123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;
    mockSessionService = {
      sessionInformation: { id: '1' },
      logOut: jest.fn(),
    } as any;
    mockMatSnackBar = {
      open: jest.fn(),
    } as any;
    mockUserService = {
      getById: jest.fn().mockReturnValue(of(mockUser)),
      delete: jest.fn().mockReturnValue(of(undefined)),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [MatIconModule, MatCardModule, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('should display user information', () => {
    const nameElement = fixture.debugElement.query(By.css('p:nth-of-type(1)'));
    const emailElement = fixture.debugElement.query(By.css('p:nth-of-type(2)'));

    expect(nameElement.nativeElement.textContent).toContain('Name: John DOE');
    expect(emailElement.nativeElement.textContent).toContain(
      'Email: test@test.com'
    );
  });

  it('should display admin message for admin users', () => {
    component.user = { ...mockUser, admin: true };
    fixture.detectChanges();

    const adminElement = fixture.debugElement.query(By.css('p:nth-child(3)'));
    expect(adminElement.nativeElement.textContent).toContain('You are admin');
  });

  it('should display delete button for non-admin users', () => {
    const deleteButton = fixture.debugElement.query(
      By.css('button[color="warn"]')
    );
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.nativeElement.textContent.trim()).toBe('deleteDetail');
  });

  it('should not display delete button for admin users', () => {
    component.user = { ...mockUser, admin: true };
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(
      By.css('button[color="warn"]')
    );
    expect(deleteButton).toBeNull();
  });

  it('should call back() method when back button is clicked', () => {
    const spy = jest.spyOn(component, 'back');
    const backButton = fixture.debugElement.query(
      By.css('button[mat-icon-button]')
    );

    backButton.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call delete() method when delete button is clicked', () => {
    const spy = jest.spyOn(component, 'delete');
    const deleteButton = fixture.debugElement.query(
      By.css('button[color="warn"]')
    );

    deleteButton.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
});
