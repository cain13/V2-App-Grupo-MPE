import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabInicioPageRoutingModule } from './tab-inicio-routing.module';

import { TabInicioPage } from './tab-inicio.page';
import { SubrespuestaModalPage } from '../subrespuesta-modal/subrespuesta-modal.page';
import { PopoverElegirTestV2Component } from 'src/app/components/popover-elegir-test-v2/popover-elegir-test-v2.component';

@NgModule({
  entryComponents: [
    PopoverElegirTestV2Component,
    SubrespuestaModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabInicioPageRoutingModule
  ],
  declarations: [TabInicioPage]
})
export class TabInicioPageModule {}
