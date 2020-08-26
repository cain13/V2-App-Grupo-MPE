import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasPendientesTrabajadorPageRoutingModule } from './citas-pendientes-trabajador-routing.module';

import { CitasPendientesTrabajadorPage } from './citas-pendientes-trabajador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitasPendientesTrabajadorPageRoutingModule
  ],
  declarations: [CitasPendientesTrabajadorPage]
})
export class CitasPendientesTrabajadorPageModule {}
