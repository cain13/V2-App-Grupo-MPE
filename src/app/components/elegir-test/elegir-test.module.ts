import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElegirTestPageRoutingModule } from './elegir-test-routing.module';

import { ElegirTestPage } from './elegir-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElegirTestPageRoutingModule
  ],
  declarations: [ElegirTestPage]
})
export class ElegirTestPageModule {}
