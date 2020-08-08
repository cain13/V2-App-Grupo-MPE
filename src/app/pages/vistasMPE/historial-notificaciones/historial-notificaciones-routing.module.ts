import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialNotificacionesPage } from './historial-notificaciones.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialNotificacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialNotificacionesPageRoutingModule {}
