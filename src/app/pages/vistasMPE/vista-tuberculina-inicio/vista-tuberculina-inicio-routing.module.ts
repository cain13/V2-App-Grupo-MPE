import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaTuberculinaInicioPage } from './vista-tuberculina-inicio.page';

const routes: Routes = [
  {
    path: '',
    component: VistaTuberculinaInicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaTuberculinaInicioPageRoutingModule {}
