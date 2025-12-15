import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/admin/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  // Helper to safely detect availability of localStorage (works with SSR / tests)
  private storageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch (e) {
      return false;
    }
  }

  // Método auxiliar para guardar el token en localStorage (seguro)
  saveToken(response: LoginResponse): void {
    if (!this.storageAvailable()) return;
    try {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('token_type', response.token_type);
      localStorage.setItem('role', response.role);
      localStorage.setItem('username', response.username);
    } catch (e) {
      // Si falla el almacenamiento, no queremos tirar la app; logueamos en consola para debugging.
      console.warn('No se pudo guardar token en localStorage:', e);
    }
  }

  // Método auxiliar para obtener el token (seguro)
  getToken(): string | null {
    if (!this.storageAvailable()) return null;
    try {
      return localStorage.getItem('access_token');
    } catch {
      return null;
    }
  }

  // Método auxiliar para limpiar sesión (seguro)
  logout(): void {
    if (!this.storageAvailable()) return;
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
    } catch (e) {
      console.warn('No se pudo limpiar localStorage:', e);
    }
  }

  // Método para verificar si hay sesión activa (seguro)
  isAuthenticated(): boolean {
    if (!this.storageAvailable()) return false;
    try {
      return !!localStorage.getItem('access_token');
    } catch {
      return false;
    }
  }

  // Método para obtener el rol (seguro)
  getRole(): string | null {
    if (!this.storageAvailable()) return null;
    try {
      return localStorage.getItem('role');
    } catch {
      return null;
    }
  }

  // Método para obtener el username (seguro)
  getUsername(): string | null {
    if (!this.storageAvailable()) return null;
    try {
      return localStorage.getItem('username');
    } catch {
      return null;
    }
  }
}
