import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogComponent } from './log.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

describe('LogComponent', () => {
  let component: LogComponent;
  let fixture: ComponentFixture<LogComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUsername']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockAuthService.getUsername.and.returnValue('admin');

    await TestBed.configureTestingModule({
      imports: [LogComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load username on init', () => {
    fixture.detectChanges();
    expect(component.currentUsername).toBe('admin');
  });

  it('should load logs on init', (done) => {
    fixture.detectChanges();
    setTimeout(() => {
      expect(component.logs.length).toBeGreaterThan(0);
      expect(component.loading).toBeFalse();
      done();
    }, 900);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('success')).toBe('status-success');
    expect(component.getStatusClass('error')).toBe('status-error');
    expect(component.getStatusClass('pending')).toBe('status-pending');
  });

  it('should return correct status text', () => {
    expect(component.getStatusText('success')).toBe('✓ Exitoso');
    expect(component.getStatusText('error')).toBe('✗ Error');
    expect(component.getStatusText('pending')).toBe('⏳ Pendiente');
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/retiros/carga-excel']);
  });
});
