import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VigilanciaSaludPageRoutingModule } from './vigilancia-salud-routing.module';

import { VigilanciaSaludPage } from './vigilancia-salud.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VigilanciaSaludPageRoutingModule,
    ComponentsModule
  ],
  declarations: [VigilanciaSaludPage]
})
export class VigilanciaSaludPageModule {}
