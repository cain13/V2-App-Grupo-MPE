import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasPendientesTrabajadorMenuPage } from './citas-pendientes-trabajador-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CitasPendientesTrabajadorMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasPendientesTrabajadorMenuPageRoutingModule {}
