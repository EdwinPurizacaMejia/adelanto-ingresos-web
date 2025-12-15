import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card" role="region" aria-label="Ingreso Pay Jobber">
        <div class="card-brand">
          <div class="logo" aria-hidden="true">
            <!-- Icono de retiro / billete -->
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
              <rect x="2" y="6" width="20" height="12" rx="2" fill="rgba(255,255,255,0.12)"/>
              <circle cx="12" cy="12" r="3.2" stroke="white" stroke-width="1.2" fill="rgba(255,255,255,0.02)"/>
              <path d="M11 11.2c0-.66.9-.66.9 0 .1.66-.9.66-.9 0z" fill="white" opacity="0.95"/>
              <path d="M7 9.5v5" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 9.5v5" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 7l2-2 2 2" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="brand-text">
            <h1>Pay Jobber</h1>
            <p>Acceso de Administración</p>
          </div>
        </div>

        <form (ngSubmit)="login()" class="form" autocomplete="on" novalidate>
          <div class="form-group">
            <label for="username">Usuario</label>
            <input id="username" type="text" [(ngModel)]="username" name="username" required [disabled]="loading" placeholder="Ingresa tu usuario" />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-wrapper">
              <input id="password" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" required [disabled]="loading" placeholder="Ingresa tu contraseña" />
              <button type="button" class="toggle" (click)="toggleShowPassword()" [attr.aria-pressed]="showPassword" [disabled]="loading">{{ showPassword ? 'Ocultar' : 'Mostrar' }}</button>
            </div>
          </div>

          <div class="form-actions">
            <label class="remember">
              <input type="checkbox" [(ngModel)]="remember" name="remember" [disabled]="loading" /> Recuérdame
            </label>
            <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Cargando...' : 'Ingresar' }}</button>
          </div>
        </form>

        <p class="message" [ngClass]="messageType" *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background: linear-gradient(135deg,#f3f6fd 0%, #ffffff 40%, #f7fafc 100%);
      padding: 2rem;
    }

    .card {
      width: 420px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(20,40,60,0.12);
      padding: 2rem;
      box-sizing: border-box;
      border: 1px solid rgba(16,24,40,0.04);
    }

    .card-brand {
      display:flex;
      align-items:center;
      gap:12px;
      margin-bottom:1rem;
    }

    .logo {
      width:56px;
      height:56px;
      border-radius:10px;
      background: linear-gradient(135deg,#1976d2,#42a5f5);
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
      font-size:1.25rem;
      box-shadow: 0 4px 10px rgba(25,118,210,0.2);
    }

    .logo-svg {
      display:block;
      width:34px;
      height:34px;
      color: #fff;
    }

    .brand-text h1 {
      margin:0;
      font-size:1rem;
      color:#0f1724;
      font-weight:700;
    }

    .brand-text p {
      margin:0;
      font-size:0.85rem;
      color:#475569;
    }

    .form {
      margin-top:1rem;
    }

    .form-group {
      margin-bottom: 0.9rem;
      text-align:left;
    }

    .form-group label {
      display:block;
      font-size:0.85rem;
      color:#374151;
      margin-bottom:0.35rem;
    }

    .form-group input {
      width:100%;
      padding:0.65rem 0.75rem;
      border-radius:8px;
      border:1px solid #e6e9ef;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
      font-size:0.95rem;
      color:#0f1724;
      box-sizing:border-box;
    }

    .password-wrapper {
      display:flex;
      gap:8px;
    }

    .password-wrapper .toggle {
      background:transparent;
      border:none;
      color:#2563eb;
      font-weight:600;
      padding:0 0.5rem;
      cursor:pointer;
      border-radius:6px;
    }

    .password-wrapper .toggle:disabled {
      color:#94a3b8;
      cursor:not-allowed;
    }

    .form-actions {
      display:flex;
      align-items:center;
      gap:12px;
      margin-top:1rem;
      justify-content:space-between;
    }

    .remember {
      font-size:0.85rem;
      color:#475569;
      display:flex;
      align-items:center;
      gap:8px;
    }

    .btn-primary {
      background:linear-gradient(180deg,#1976d2,#1565c0);
      color:#fff;
      border:none;
      padding:0.65rem 1rem;
      border-radius:8px;
      cursor:pointer;
      min-width:140px;
      font-weight:600;
      box-shadow: 0 6px 18px rgba(25,118,210,0.18);
    }

    .btn-primary:disabled {
      opacity:0.6;
      cursor:not-allowed;
    }

    .message {
      margin-top:1rem;
      padding:0.6rem;
      border-radius:6px;
      font-size:0.9rem;
    }

    .message.error {
      color:#991b1b;
      background:#fff5f5;
      border:1px solid #fecaca;
    }

    .message.success {
      color:#14532d;
      background:#ecfdf5;
      border:1px solid #bbf7d0;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .card {
        width: 100%;
        padding: 1.25rem;
      }
      .form-actions {
        flex-direction: column-reverse;
        gap: 8px;
        align-items: stretch;
      }
      .btn-primary { width:100%; }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  remember = false;
  showPassword = false;
  message = '';
  messageType: 'error' | 'success' | '' = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.username || !this.password) {
      this.message = 'Debe ingresar usuario y contraseña';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.message = 'Autenticando...';
    this.messageType = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        // Preservar comportamiento existente
        this.authService.saveToken(response);
        this.message = `¡Bienvenido ${response.username}! Redirigiendo...`;
        this.messageType = 'success';
        this.loading = false;

        // Redirigir según el rol
        setTimeout(() => {
          if (response.role === 'admin') {
            this.router.navigate(['/retiros']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 900);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en login:', err);

        if (err && err.status === 401) {
          this.message = 'Usuario o contraseña incorrectos';
        } else if (err && err.status === 0) {
          this.message = 'No se pudo conectar al servidor. Verifica la URL de la API.';
        } else {
          this.message = 'Error al autenticarse. Intenta de nuevo.';
        }
        this.messageType = 'error';
      }
    });
  }
}
