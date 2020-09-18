import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabInicioPage } from './tab-inicio.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tab-inicio/inicio',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabInicioPage,
    children: [
      {
        path: 'vigilancia-salud',
        loadChildren: () => import('../vigilancia-salud/vigilancia-salud.module').then( m => m.VigilanciaSaludPageModule)
      },
      {
        path: 'home-location-menu',
        loadChildren: () => import('../home-location-menu/home-location-menu.module').then( m => m.HomeLocationMenuPageModule)
      },
      {
        path: 'inicio',
        loadChildren: () => import('../inicio/inicio.module').then( m => m.InicioPageModule)
      },
      {
        path: 'citas-pendientes',
        loadChildren: () => import('../citas-pendientes/citas-pendientes.module').then( m => m.CitasPendientesPageModule)
      },
      {
        path: 'documentos',
        loadChildren: () => import('../certificado-aptitud/certificado-aptitud.module').then( m => m.CertificadoAptitudPageModule)
      },
      {
        path: 'covid',
        loadChildren: () => import('../documentos-covid/documentos-covid.module').then( m => m.DocumentosCOVIDPageModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabInicioPageRoutingModule {}
