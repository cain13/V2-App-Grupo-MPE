import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialNotificacionesPageRoutingModule } from './historial-notificaciones-routing.module';

import { HistorialNotificacionesPage } from './historial-notificaciones.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HistorialNotificacionesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialNotificacionesPageRoutingModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [HistorialNotificacionesPage]
})
export class HistorialNotificacionesPageModule {}
