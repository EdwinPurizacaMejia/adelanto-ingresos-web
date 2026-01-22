// EJEMPLO DE ACTUALIZACIÓN - carga-excel.component.ts

/*
Este archivo muestra cómo actualizar el componente CargaExcelComponent
para utilizar el token de autenticación del servicio AuthService.

NOTA: Si implementaste el AuthInterceptor, el token se agregará
automáticamente a todas las peticiones, por lo que no necesitarías
agregarlo manualmente en el header.
*/

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-carga-excel',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="carga-container">
      <h2>Carga de Archivo Excel</h2>

      <input type="file" (change)="onFileSelected($event)" accept=".xlsx" [disabled]="loading" />
      <button (click)="uploadFile()" [disabled]="!selectedFile || loading">
        {{ loading ? 'Cargando...' : 'Subir archivo' }}
      </button>

      <div *ngIf="message" [ngClass]="messageType" class="message">{{ message }}</div>
      
      <div *ngIf="currentUser" class="user-info">
        <small>Conectado como: <strong>{{ currentUser }}</strong></small>
      </div>
    </div>
  `,
  styles: [`
    .carga-container {
      max-width: 400px;
      margin: 60px auto;
      padding: 2rem;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    input {
      display: block;
      margin: 1rem auto;
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
    button {
      padding: 0.6rem 1.2rem;
      background-color: #2e7d32;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
    }
    button:hover:not(:disabled) {
      background-color: #1b5e20;
    }
    button:disabled {
      background-color: #cccccc;
      cursor:not-allowed;
    }
    .message {
      margin-top: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      font-weight: 500;
    }
    .message.success {
      color: #2e7d32;
      background-color: #e8f5e9;
      border: 1px solid #66bb6a;
    }
    .message.error {
      color: #c62828;
      background-color: #ffebee;
      border: 1px solid #ef5350;
    }
    .user-info {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      color: #666;
    }
  `]
})
export class CargaExcelComponent {
  selectedFile?: File;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  loading = false;
  currentUser: string | null = null;

  // use inject() to obtain AuthService safely (avoids DI metadata issues in some tooling)
  private authService = inject(AuthService);

  constructor(private http: HttpClient) {
    // Obtener el usuario actual de forma segura
    try {
      this.currentUser = this.authService.getUsername();
    } catch {
      this.currentUser = null;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.message = `Archivo seleccionado: ${this.selectedFile.name}`;
      this.messageType = '';
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.message = 'Subiendo archivo...';
    this.messageType = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // OPCIÓN 1: Si usas AuthInterceptor, no necesitas agregar el header
    // El interceptor lo agrega automáticamente
    const apiUrl = `${environment.apiUrl}/retiros/disponibilidad/cargar`;

    // Si prefieres agregar el token manualmente:
    // const token = this.authService.getToken();
    // const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;

    this.http.post(apiUrl, formData)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.message = res.message || 'Archivo cargado con éxito ✅';
          this.messageType = 'success';
          this.selectedFile = undefined;
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al subir archivo:', err);
          
          if (err.status === 401) {
            this.message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            this.authService.logout();
          } else if (err.status === 403) {
            this.message = 'No tienes permiso para cargar archivos.';
          } else {
            this.message = 'Error al subir archivo: ' + (err.error?.detail || err.message || 'Error desconocido');
          }
          this.messageType = 'error';
        }
      });
  }
}

/*
CAMBIOS REALIZADOS:
===================

1. ✅ Usar inject(AuthService) en lugar de inyección por constructor para evitar errores de token de inyección en herramientas/entornos concretos.
2. ✅ Se muestra currentUser mediante AuthService.getUsername() (seguro).
3. ✅ Uso de environment.apiUrl en lugar de URL hardcodeada (si existe).
4. ✅ Manejo de errores 401/403 y mensajes de estado.
5. ✅ Recomendación: usa AuthInterceptor para añadir token automáticamente si lo prefieres.
*/
