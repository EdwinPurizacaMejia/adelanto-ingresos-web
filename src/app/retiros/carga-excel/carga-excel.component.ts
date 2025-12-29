import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-carga-excel',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './carga-excel.component.html',
  styleUrls: ['./carga-excel.component.scss']
})
export class CargaExcelComponent {
  selectedFile?: File;
  message = '';
  messageType: 'error' | 'success' | '' = '';
  uploading = false;
  progress = 0;
  isDragOver = false;

  private uploadUrl = `${environment.apiUrl}/retiros/disponibilidad/cargar`;

  // inject AuthService to avoid potential DI metadata/cycle issues
  private authService = inject(AuthService);

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target?.files?.[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files?.[0];
    this.handleFile(file);
  }

  handleFile(file?: File) {
    if (!file) {
      this.selectedFile = undefined;
      this.message = '';
      return;
    }
    // Basic validation: extension and size (e.g., < 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.selectedFile = undefined;
      this.message = 'El archivo excede el tamaño máximo permitido (10 MB).';
      this.messageType = 'error';
      return;
    }
    // Accept by extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['xlsx', 'xls'].includes(ext)) {
      this.selectedFile = undefined;
      this.message = 'Formato no válido. Selecciona un archivo .xlsx o .xls';
      this.messageType = 'error';
      return;
    }

    this.selectedFile = file;
    this.message = `Archivo seleccionado: ${file.name}`;
    this.messageType = '';
    this.progress = 0;
  }

  removeSelected() {
    this.selectedFile = undefined;
    this.message = '';
    this.progress = 0;
  }

  reset() {
    this.removeSelected();
    this.messageType = '';
    this.message = '';
    this.uploading = false;
  }

  uploadFile() {
    if (!this.selectedFile || this.uploading) return;

    const formData = new FormData();
    // Asegurar que el archivo se agregue correctamente con su nombre original
    formData.append('file', this.selectedFile, this.selectedFile.name);

    // Use AuthService.getToken() (safe) instead of direct localStorage access
    const token = this.authService.getToken();
    // No establecer Content-Type manualmente para FormData, el navegador lo hace automáticamente
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;

    this.uploading = true;
    this.progress = 0;
    this.message = '';
    this.messageType = '';

    console.log('Subiendo archivo:', this.selectedFile.name, 'Tamaño:', this.selectedFile.size, 'bytes');
    console.log('URL de destino:', this.uploadUrl);

    this.http.post(this.uploadUrl, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploading = false;
          this.progress = 100;
          this.message = 'Archivo cargado con éxito';
          this.messageType = 'success';
          setTimeout(() => this.removeSelected(), 1200);
        }
      },
      error: (err) => {
        this.uploading = false;
        this.progress = 0;
        this.messageType = 'error';
        const detail = err?.error?.detail || err?.message || 'Error desconocido';
        this.message = `Error al subir archivo: ${detail}`;
        console.error('Error completo:', err);
      }
    });
  }

  formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
