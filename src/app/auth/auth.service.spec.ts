import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginResponse } from './auth.service';

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
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login endpoint with correct credentials', () => {
    const mockResponse: LoginResponse = {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzYzMDUwMjg2fQ.9ss38_ZNybS7MMxRvj6fkaj1GOIb0UyLFvsNHfxheIc',
      token_type: 'bearer',
      role: 'admin',
      username: 'admin'
    };

    service.login({ username: 'admin', password: '123456' }).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://192.168.0.6:8000/admin/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'admin', password: '123456' });
    req.flush(mockResponse);
  });

  it('should save token to localStorage', () => {
    const mockResponse: LoginResponse = {
      access_token: 'test_token',
      token_type: 'bearer',
      role: 'admin',
      username: 'admin'
    };

    service.saveToken(mockResponse);

    expect(localStorage.getItem('access_token')).toBe('test_token');
    expect(localStorage.getItem('token_type')).toBe('bearer');
    expect(localStorage.getItem('role')).toBe('admin');
    expect(localStorage.getItem('username')).toBe('admin');
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('access_token', 'test_token');
    expect(service.getToken()).toBe('test_token');
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('access_token', 'test_token');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('username', 'admin');

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
  });

  it('should check if user is authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();

    localStorage.setItem('access_token', 'test_token');
    expect(service.isAuthenticated()).toBeTrue();
  });
});
