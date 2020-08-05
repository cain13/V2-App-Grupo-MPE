import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanficacionVSPageRoutingModule } from './planficacion-vs-routing.module';

import { PlanficacionVSPage } from './planficacion-vs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanficacionVSPageRoutingModule
  ],
  declarations: [PlanficacionVSPage]
})
export class PlanficacionVSPageModule {}
