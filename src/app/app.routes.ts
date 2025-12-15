import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'retiros',
    loadChildren: () => import('./retiros/retiros.routes').then(m => m.RETIROS_ROUTES),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
