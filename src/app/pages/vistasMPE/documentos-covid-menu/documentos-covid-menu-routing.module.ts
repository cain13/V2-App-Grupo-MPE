import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosCovidMenuPage } from './documentos-covid-menu.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentosCovidMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentosCovidMenuPageRoutingModule {}
