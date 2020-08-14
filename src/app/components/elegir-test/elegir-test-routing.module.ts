import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElegirTestPage } from './elegir-test.page';

const routes: Routes = [
  {
    path: '',
    component: ElegirTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElegirTestPageRoutingModule {}
