import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaCertificadoPage } from './vista-certificado.page';

const routes: Routes = [
  {
    path: '',
    component: VistaCertificadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaCertificadoPageRoutingModule {}
