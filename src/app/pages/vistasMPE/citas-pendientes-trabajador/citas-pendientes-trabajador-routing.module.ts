import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasPendientesTrabajadorPage } from './citas-pendientes-trabajador.page';

const routes: Routes = [
  {
    path: '',
    component: CitasPendientesTrabajadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasPendientesTrabajadorPageRoutingModule {}
