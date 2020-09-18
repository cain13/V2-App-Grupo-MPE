import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasPendientesPageRoutingModule } from './citas-pendientes-routing.module';

import { CitasPendientesPage } from './citas-pendientes.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitasPendientesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CitasPendientesPage]
})
export class CitasPendientesPageModule {}
