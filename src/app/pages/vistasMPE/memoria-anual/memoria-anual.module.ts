import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoriaAnualPageRoutingModule } from './memoria-anual-routing.module';

import { MemoriaAnualPage } from './memoria-anual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoriaAnualPageRoutingModule
  ],
  declarations: [MemoriaAnualPage]
})
export class MemoriaAnualPageModule {}
