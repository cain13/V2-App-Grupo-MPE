import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCondicionesPageRoutingModule } from './modal-condiciones-routing.module';

import { ModalCondicionesPage } from './modal-condiciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCondicionesPageRoutingModule
  ],
  declarations: [ModalCondicionesPage]
})
export class ModalCondicionesPageModule {}
