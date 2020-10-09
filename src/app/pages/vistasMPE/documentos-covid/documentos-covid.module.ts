import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentosCOVIDPageRoutingModule } from './documentos-covid-routing.module';

import { DocumentosCOVIDPage } from './documentos-covid.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentosCOVIDPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule
  ],
  declarations: [DocumentosCOVIDPage]
})
export class DocumentosCOVIDPageModule {}
