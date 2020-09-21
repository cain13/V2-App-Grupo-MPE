import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosTrabajadorMenuPage } from './documentos-trabajador-menu.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentosTrabajadorMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentosTrabajadorMenuPageRoutingModule {}
