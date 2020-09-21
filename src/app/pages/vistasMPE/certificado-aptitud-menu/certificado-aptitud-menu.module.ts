import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CertificadoAptitudMenuPageRoutingModule } from './certificado-aptitud-menu-routing.module';

import { CertificadoAptitudMenuPage } from './certificado-aptitud-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CertificadoAptitudMenuPageRoutingModule
  ],
  declarations: [CertificadoAptitudMenuPage]
})
export class CertificadoAptitudMenuPageModule {}
