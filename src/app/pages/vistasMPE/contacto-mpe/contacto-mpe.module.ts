import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactoMpePageRoutingModule } from './contacto-mpe-routing.module';

import { ContactoMpePage } from './contacto-mpe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactoMpePageRoutingModule
  ],
  declarations: [ContactoMpePage]
})
export class ContactoMpePageModule {}
