import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormacionPage } from './formacion.page';

const routes: Routes = [
  {
    path: '',
    component: FormacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormacionPageRoutingModule {}
