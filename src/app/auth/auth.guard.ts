import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanDeactivate
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      // Verificar si la ruta requiere un rol específico
      if (route.data['roles'] && route.data['roles'].length > 0) {
        const userRole = this.authService.getRole();
        if (route.data['roles'].includes(userRole)) {
          return true;
        } else {
          // El usuario no tiene el rol necesario
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }
      return true;
    } else {
      // Usuario no autenticado, redirigir a login
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const userRole = this.authService.getRole();
    
    if (this.authService.isAuthenticated() && userRole === 'admin') {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
