import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestPageRoutingModule } from './test-routing.module';

import { TestPage } from './test.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverElegirTestV2Component } from '../../../components/popover-elegir-test-v2/popover-elegir-test-v2.component';
import { ElegirTestPage } from '../../../components/elegir-test/elegir-test.page';
import { ComponentsModule } from '../../../components/components.module';
import { SubrespuestaModalPage } from '../subrespuesta-modal/subrespuesta-modal.page';
import { SubrespuestaModalPageModule } from '../subrespuesta-modal/subrespuesta-modal.module';

@NgModule({
  entryComponents: [
    PopoverElegirTestV2Component,
    SubrespuestaModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule,
    SubrespuestaModalPageModule

  ],
  declarations: [TestPage]
})
export class TestPageModule {}
