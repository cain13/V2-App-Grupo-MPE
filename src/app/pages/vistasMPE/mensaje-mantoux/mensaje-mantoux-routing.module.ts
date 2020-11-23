import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensajeMantouxPage } from './mensaje-mantoux.page';

const routes: Routes = [
  {
    path: '',
    component: MensajeMantouxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensajeMantouxPageRoutingModule {}
