import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentosCOVIDPageRoutingModule } from './documentos-covid-routing.module';

import { DocumentosCOVIDPage } from './documentos-covid.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentosCOVIDPageRoutingModule,
    TranslateModule.forChild(),

  ],
  declarations: [DocumentosCOVIDPage]
})
export class DocumentosCOVIDPageModule {}
