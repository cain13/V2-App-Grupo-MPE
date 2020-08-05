import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoriaAnualPage } from './memoria-anual.page';

const routes: Routes = [
  {
    path: '',
    component: MemoriaAnualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoriaAnualPageRoutingModule {}
