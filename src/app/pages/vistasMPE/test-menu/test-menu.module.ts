import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestMenuPageRoutingModule } from './test-menu-routing.module';

import { TestMenuPage } from './test-menu.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { PopoverElegirTestV2Component } from 'src/app/components/popover-elegir-test-v2/popover-elegir-test-v2.component';
import { SubrespuestaModalPage } from '../subrespuesta-modal/subrespuesta-modal.page';

@NgModule({
  entryComponents: [
    PopoverElegirTestV2Component,
    SubrespuestaModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestMenuPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule
  ],
  declarations: [TestMenuPage]
})
export class TestMenuPageModule {}
