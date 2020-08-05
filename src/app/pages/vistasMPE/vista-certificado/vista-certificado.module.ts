import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaCertificadoPageRoutingModule } from './vista-certificado-routing.module';

import { VistaCertificadoPage } from './vista-certificado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaCertificadoPageRoutingModule
  ],
  declarations: [VistaCertificadoPage]
})
export class VistaCertificadoPageModule {}
