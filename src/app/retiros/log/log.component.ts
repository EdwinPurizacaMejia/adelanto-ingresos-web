import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

interface UploadLog {
  id: number;
  uploadId: string;
  filename: string;
  uploadDate: string;
  uploadTime: string;
  status: 'exitoso' | 'error' | 'pendiente';
  recordsProcessed: number;
  recordsError: number;
  errorMessage?: string;
  processingTime?: number;
}

interface HistorialResponse {
  ok: boolean;
  username: string;
  total_uploads: number;
  historial: {
    id: number;
    upload_id: string;
    filename: string;
    upload_date: string;
    upload_time: string;
    status: string;
    total_records: number;
    successful_records: number;
    failed_records: number;
    error_message: string | null;
    processing_time: number;
  }[];
}

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  logs: UploadLog[] = [];
  loading = true;
  errorMessage: string | null = null;
  currentUsername: string | null = null;
  totalUploads = 0;

  private historialUrl = `${environment.apiUrl}/retiros/disponibilidad/historial`;
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUsername = this.authService.getUsername();
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.errorMessage = null;

    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;

    console.log('Cargando historial desde:', this.historialUrl);

    this.http.get<HistorialResponse>(this.historialUrl, { headers }).subscribe({
      next: (response) => {
        console.log('Historial recibido:', response);
        
        if (response.ok && response.historial) {
          this.totalUploads = response.total_uploads;
          this.currentUsername = response.username;
          
          // Mapear los datos de la API al formato del componente
          this.logs = response.historial.map(item => ({
            id: item.id,
            uploadId: item.upload_id,
            filename: item.filename,
            uploadDate: item.upload_date,
            uploadTime: item.upload_time,
            status: this.normalizeStatus(item.status),
            recordsProcessed: item.successful_records,
            recordsError: item.failed_records,
            errorMessage: item.error_message || undefined,
            processingTime: item.processing_time
          }));
        } else {
          this.logs = [];
          this.totalUploads = 0;
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
        this.loading = false;
        this.errorMessage = 'Error al cargar el historial de cargas. Por favor, intente nuevamente.';
        this.logs = [];
        this.totalUploads = 0;
      }
    });
  }

  private normalizeStatus(status: string): 'exitoso' | 'error' | 'pendiente' {
    const normalized = status.toLowerCase();
    if (normalized === 'exitoso' || normalized === 'success') return 'exitoso';
    if (normalized === 'error' || normalized === 'failed') return 'error';
    if (normalized === 'pendiente' || normalized === 'pending') return 'pendiente';
    return 'pendiente';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'exitoso': 'status-success',
      'error': 'status-error',
      'pendiente': 'status-pending'
    };
    return statusMap[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'exitoso': '✓ Exitoso',
      'error': '✗ Error',
      'pendiente': '⏳ Pendiente'
    };
    return statusMap[status] || status;
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'exitoso': '✓',
      'error': '✗',
      'pendiente': '⏳'
    };
    return iconMap[status] || '?';
  }

  retry(): void {
    this.loadLogs();
  }

  goBack(): void {
    this.router.navigate(['/retiros/carga-excel']);
  }  

downloadFile(upload_id: string): void {
  const token = this.authService.getToken();
  const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
  
  this.http.get(`${environment.apiUrl}/retiros/descargar/excel/${upload_id}`, { 
    headers,
    responseType: 'blob'  // ← Esto ya te da un Blob
  }).subscribe({
    next: (response: Blob) => {
      // NO necesitas hacer new Blob([response]) porque response YA es un Blob
      const url = window.URL.createObjectURL(response);  // ← Usar directamente
      const a = document.createElement('a');
      a.href = url;
      a.download = `retiros_anotado_${upload_id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Error al descargar el archivo:', error);
      alert('Error al descargar el archivo. Por favor, intente nuevamente.');
    }
  });
}  
}
