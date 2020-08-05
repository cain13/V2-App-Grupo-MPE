import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanficacionVSPage } from './planficacion-vs.page';

const routes: Routes = [
  {
    path: '',
    component: PlanficacionVSPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanficacionVSPageRoutingModule {}
