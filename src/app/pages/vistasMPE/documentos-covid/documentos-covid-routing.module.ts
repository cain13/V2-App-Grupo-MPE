import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosCOVIDPage } from './documentos-covid.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentosCOVIDPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentosCOVIDPageRoutingModule {}
