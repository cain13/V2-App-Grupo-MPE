import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasPendientesPage } from './citas-pendientes.page';

const routes: Routes = [
  {
    path: '',
    component: CitasPendientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasPendientesPageRoutingModule {}
