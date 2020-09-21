import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificadoAptitudMenuPage } from './certificado-aptitud-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CertificadoAptitudMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificadoAptitudMenuPageRoutingModule {}
