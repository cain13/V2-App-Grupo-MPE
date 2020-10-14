import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaTubirculinaPage } from './vista-tubirculina.page';

const routes: Routes = [
  {
    path: '',
    component: VistaTubirculinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaTubirculinaPageRoutingModule {}
