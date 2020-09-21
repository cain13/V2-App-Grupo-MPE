import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentosTrabajadorMenuPageRoutingModule } from './documentos-trabajador-menu-routing.module';

import { DocumentosTrabajadorMenuPage } from './documentos-trabajador-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentosTrabajadorMenuPageRoutingModule
  ],
  declarations: [DocumentosTrabajadorMenuPage]
})
export class DocumentosTrabajadorMenuPageModule {}
