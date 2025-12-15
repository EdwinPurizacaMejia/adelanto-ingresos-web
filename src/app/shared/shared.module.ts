import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule, // 👈 para usar routerLink en el navbar
    NavbarComponent // 👈 importamos el componente standalone
  ],
  exports: [
    NavbarComponent // 👈 lo exportamos para poder usarlo en otros módulos
  ]
})
export class SharedModule { }
