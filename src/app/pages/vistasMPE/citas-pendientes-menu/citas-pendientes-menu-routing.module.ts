import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasPendientesMenuPage } from './citas-pendientes-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CitasPendientesMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasPendientesMenuPageRoutingModule {}
