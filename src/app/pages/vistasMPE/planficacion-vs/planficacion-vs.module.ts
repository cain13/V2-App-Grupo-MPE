import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanficacionVSPageRoutingModule } from './planficacion-vs-routing.module';

import { PlanficacionVSPage } from './planficacion-vs.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanficacionVSPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PlanficacionVSPage]
})
export class PlanficacionVSPageModule {}
