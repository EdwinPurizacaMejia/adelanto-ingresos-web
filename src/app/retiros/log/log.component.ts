import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface UploadLog {
  id: number;
  filename: string;
  uploadDate: string;
  uploadTime: string;
  uploadedBy: string;
  status: 'success' | 'error' | 'pending';
  recordsProcessed: number;
  recordsError: number;
  errorMessage?: string;
}

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  logs: UploadLog[] = [];
  loading = true;
  errorMessage: string | null = null;
  currentUsername: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.authService.getUsername();
    this.loadLogs();
  }

  loadLogs(): void {
    // Datos de ejemplo - en producción consumiría una API
    this.loading = true;
    setTimeout(() => {
      this.logs = [
        {
          id: 1,
          filename: 'empleados_lote_01.xlsx',
          uploadDate: '2024-01-15',
          uploadTime: '10:30:45',
          uploadedBy: 'admin',
          status: 'success',
          recordsProcessed: 145,
          recordsError: 0
        },
        {
          id: 2,
          filename: 'empleados_lote_02.xlsx',
          uploadDate: '2024-01-15',
          uploadTime: '11:45:20',
          uploadedBy: 'admin',
          status: 'success',
          recordsProcessed: 98,
          recordsError: 2,
          errorMessage: 'Algunos registros tienen formato incorrecto'
        },
        {
          id: 3,
          filename: 'empleados_lote_03.xlsx',
          uploadDate: '2024-01-14',
          uploadTime: '14:12:30',
          uploadedBy: 'admin',
          status: 'error',
          recordsProcessed: 0,
          recordsError: 156,
          errorMessage: 'Archivo corrupto o formato no soportado'
        },
        {
          id: 4,
          filename: 'empleados_lote_04.xlsx',
          uploadDate: '2024-01-14',
          uploadTime: '09:00:15',
          uploadedBy: 'admin',
          status: 'success',
          recordsProcessed: 200,
          recordsError: 0
        },
        {
          id: 5,
          filename: 'empleados_lote_05.xlsx',
          uploadDate: '2024-01-13',
          uploadTime: '16:25:00',
          uploadedBy: 'admin',
          status: 'pending',
          recordsProcessed: 0,
          recordsError: 0
        }
      ];
      this.loading = false;
    }, 800);
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'success': 'status-success',
      'error': 'status-error',
      'pending': 'status-pending'
    };
    return statusMap[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'success': '✓ Exitoso',
      'error': '✗ Error',
      'pending': '⏳ Pendiente'
    };
    return statusMap[status] || status;
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'success': '✓',
      'error': '✗',
      'pending': '⏳'
    };
    return iconMap[status] || '?';
  }

  goBack(): void {
    this.router.navigate(['/retiros/carga-excel']);
  }
}
