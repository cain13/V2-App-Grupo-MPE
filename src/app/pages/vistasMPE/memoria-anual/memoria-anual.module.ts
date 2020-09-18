import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoriaAnualPageRoutingModule } from './memoria-anual-routing.module';

import { MemoriaAnualPage } from './memoria-anual.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoriaAnualPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MemoriaAnualPage]
})
export class MemoriaAnualPageModule {}
