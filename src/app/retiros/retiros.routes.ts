import { Routes } from '@angular/router';
import { CargaExcelComponent } from './carga-excel/carga-excel.component';
import { LogComponent } from './log/log.component';
import { PoliticasHistorialComponent } from './politicas-historial/politicas-historial.component';

export const RETIROS_ROUTES: Routes = [
  {
    path: 'politicas-historial',
    component: PoliticasHistorialComponent,
    title: 'Log Políticas de Aceptación'
  },
  {
    path: 'carga-excel',
    component: CargaExcelComponent,
    title: 'Carga de Disponibilidad'
  },
  {
    path: 'log',
    component: LogComponent,
    title: 'Historial de Cargas'
  }
];
