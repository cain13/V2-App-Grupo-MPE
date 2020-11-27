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
        loadChildren: () => import('../construccion/construccion.module').then( m => m.ConstruccionPageModule)
      },
      {
        path: 'documentos',
        loadChildren: () => import('../certificado-aptitud/certificado-aptitud.module').then( m => m.CertificadoAptitudPageModule)
      },
      {
        path: 'citas-pendientes-trabajador',
        loadChildren: () => import('../construccion/construccion.module').then( m => m.ConstruccionPageModule)
      },
      {
        path: 'documentos-trabajador',
        loadChildren: () => import('../documentos-trabajador/documentos-trabajador.module').then( m => m.DocumentosTrabajadorPageModule)
      },
      {
        path: 'documentos-covid',
        loadChildren: () => import('../documentos-covid/documentos-covid.module').then( m => m.DocumentosCOVIDPageModule)
      },
      {
        path: 'test-menu',
        loadChildren: () => import('../test-menu/test-menu.module').then( m => m.TestMenuPageModule)
      },
      {
        path: 'formacion',
        loadChildren: () => import('../construccion/construccion.module').then( m => m.ConstruccionPageModule)
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabInicioPageRoutingModule {}
