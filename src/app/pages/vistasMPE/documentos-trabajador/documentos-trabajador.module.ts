import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';


import { DocumentosTrabajadorPageRoutingModule } from './documentos-trabajador-routing.module';

import { DocumentosTrabajadorPage } from './documentos-trabajador.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentosTrabajadorPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule

  ],
  declarations: [DocumentosTrabajadorPage]
})
export class DocumentosTrabajadorPageModule {}
