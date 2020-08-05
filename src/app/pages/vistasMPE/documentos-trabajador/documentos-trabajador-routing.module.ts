import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosTrabajadorPage } from './documentos-trabajador.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentosTrabajadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentosTrabajadorPageRoutingModule {}
