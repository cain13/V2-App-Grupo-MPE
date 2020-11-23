import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConstruccionPageRoutingModule } from './construccion-routing.module';

import { ConstruccionPage } from './construccion.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConstruccionPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ConstruccionPage]
})
export class ConstruccionPageModule {}