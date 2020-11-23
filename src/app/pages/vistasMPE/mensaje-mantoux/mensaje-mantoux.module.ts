import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensajeMantouxPageRoutingModule } from './mensaje-mantoux-routing.module';

import { MensajeMantouxPage } from './mensaje-mantoux.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensajeMantouxPageRoutingModule
  ],
  declarations: [MensajeMantouxPage]
})
export class MensajeMantouxPageModule {}
