import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CentrosFavoritosPage } from './centros-favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: CentrosFavoritosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentrosFavoritosPageRoutingModule {}
