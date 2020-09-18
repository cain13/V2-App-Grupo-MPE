import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VigilanciaSaludPage } from './vigilancia-salud.page';

const routes: Routes = [
  {
    path: '',
    component: VigilanciaSaludPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VigilanciaSaludPageRoutingModule {}
