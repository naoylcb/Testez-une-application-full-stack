import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;
  let mockUser: SessionInformation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
    mockUser = {
      id: 1,
      token: 'token',
      type: 'user',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false,
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('$isLogged', () => {
    it('should return an Observable of isLogged', (done) => {
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeFalsy();
        done();
      });
    });
  });

  describe('logIn', () => {
    it('should set isLogged to true and update sessionInformation', () => {
      service.logIn(mockUser);
      expect(service.isLogged).toBeTruthy();
      expect(service.sessionInformation).toEqual(mockUser);
    });

    it('should emit true on $isLogged Observable', (done) => {
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeTruthy();
        done();
      });
      service.logIn(mockUser);
    });
  });

  describe('logOut', () => {
    it('should set isLogged to false and clear sessionInformation', () => {
      service.logIn(mockUser);
      service.logOut();
      expect(service.isLogged).toBeFalsy();
      expect(service.sessionInformation).toBeUndefined();
    });

    it('should emit false on $isLogged Observable', (done) => {
      service.logIn(mockUser);
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeFalsy();
        done();
      });
      service.logOut();
    });
  });
});
