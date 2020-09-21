import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasPendientesMenuPageRoutingModule } from './citas-pendientes-menu-routing.module';

import { CitasPendientesMenuPage } from './citas-pendientes-menu.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitasPendientesMenuPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CitasPendientesMenuPage]
})
export class CitasPendientesMenuPageModule {}
