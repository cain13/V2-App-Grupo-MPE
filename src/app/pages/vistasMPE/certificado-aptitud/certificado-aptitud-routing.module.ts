import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificadoAptitudPage } from './certificado-aptitud.page';

const routes: Routes = [
  {
    path: '',
    component: CertificadoAptitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificadoAptitudPageRoutingModule {}
