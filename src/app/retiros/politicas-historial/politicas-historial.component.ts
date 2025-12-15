import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface HistorialItem {
  log_id: string;
  timestamp: string;
  version_politica: string;
  ip_address: string | null;
  user_agent: string | null;
  accepted: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-politicas-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './politicas-historial.component.html',
  styleUrls: ['./politicas-historial.component.scss']
})
export class PoliticasHistorialComponent {
  tipoDocumento: string = 'DNI';
  numeroDocumento: string = '';
  historial: HistorialItem[] = [];
  loading: boolean = false;
  error: string = '';
  
  tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'CE' }
  ];

  constructor(private http: HttpClient) {}

  consultarHistorial(): void {
    if (!this.numeroDocumento.trim()) {
      this.error = 'Por favor ingrese un número de documento';
      return;
    }

    this.loading = true;
    this.error = '';
    this.historial = [];

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${environment.apiUrl}/politicas/historial/${this.tipoDocumento}/${this.numeroDocumento}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.historial && Array.isArray(response.historial)) {
          this.historial = response.historial;
          if (this.historial.length === 0) {
            this.error = 'No se encontraron registros en el historial';
          }
        } else if (response && Array.isArray(response)) {
          this.historial = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.historial = response.data;
        } else {
          this.historial = [];
          this.error = 'No se encontraron registros en el historial';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al consultar historial:', err);
        this.error = err.error?.message || 'Error al consultar el historial. Por favor intente nuevamente.';
      }
    });
  }

  limpiar(): void {
    this.numeroDocumento = '';
    this.tipoDocumento = 'DNI';
    this.historial = [];
    this.error = '';
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('es-PE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
