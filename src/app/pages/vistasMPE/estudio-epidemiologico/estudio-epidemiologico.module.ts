import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstudioEpidemiologicoPageRoutingModule } from './estudio-epidemiologico-routing.module';

import { EstudioEpidemiologicoPage } from './estudio-epidemiologico.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstudioEpidemiologicoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EstudioEpidemiologicoPage]
})
export class EstudioEpidemiologicoPageModule {}
