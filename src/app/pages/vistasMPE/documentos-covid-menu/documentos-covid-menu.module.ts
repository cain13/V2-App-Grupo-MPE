import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentosCovidMenuPageRoutingModule } from './documentos-covid-menu-routing.module';

import { DocumentosCovidMenuPage } from './documentos-covid-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentosCovidMenuPageRoutingModule
  ],
  declarations: [DocumentosCovidMenuPage]
})
export class DocumentosCovidMenuPageModule {}
