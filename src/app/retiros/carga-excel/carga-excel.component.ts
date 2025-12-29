import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
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

  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:...;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  async uploadFile() {
    if (!this.selectedFile || this.uploading) return;

    this.uploading = true;
    this.progress = 33;
    this.message = 'Preparando archivo...';
    this.messageType = '';

    try {
      console.log('Subiendo archivo:', this.selectedFile.name, 'Tamaño:', this.selectedFile.size, 'bytes');
      console.log('URL de destino:', this.uploadUrl);

      // Convertir el archivo a base64
      this.message = 'Convirtiendo archivo...';
      this.progress = 50;
      const base64Content = await this.convertFileToBase64(this.selectedFile);
      
      console.log('Archivo convertido a base64, longitud:', base64Content.length);

      // Preparar el payload con el archivo en base64
      const payload = {
        filename: this.selectedFile.name,
        content: base64Content,
        content_type: this.selectedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };

      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      });

      this.message = 'Enviando archivo...';
      this.progress = 75;

      this.http.post(this.uploadUrl, payload, { headers }).subscribe({
        next: (response) => {
          console.log('Respuesta exitosa:', response);
          this.uploading = false;
          this.progress = 100;
          this.message = 'Archivo cargado con éxito';
          this.messageType = 'success';
          setTimeout(() => this.removeSelected(), 1200);
        },
        error: (err) => {
          console.error('Error al subir archivo:', err);
          this.uploading = false;
          this.progress = 0;
          this.messageType = 'error';
          const detail = err?.error?.detail || err?.message || 'Error desconocido';
          this.message = `Error al subir archivo: ${detail}`;
        }
      });
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      this.uploading = false;
      this.progress = 0;
      this.messageType = 'error';
      this.message = 'Error al procesar el archivo';
    }
  }

  formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
