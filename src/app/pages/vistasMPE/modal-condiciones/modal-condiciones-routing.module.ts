import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCondicionesPage } from './modal-condiciones.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCondicionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCondicionesPageRoutingModule {}
