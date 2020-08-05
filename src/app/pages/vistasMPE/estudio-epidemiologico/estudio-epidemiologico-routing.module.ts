import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstudioEpidemiologicoPage } from './estudio-epidemiologico.page';

const routes: Routes = [
  {
    path: '',
    component: EstudioEpidemiologicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstudioEpidemiologicoPageRoutingModule {}
