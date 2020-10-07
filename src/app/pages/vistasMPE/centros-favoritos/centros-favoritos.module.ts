import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CentrosFavoritosPageRoutingModule } from './centros-favoritos-routing.module';

import { CentrosFavoritosPage } from './centros-favoritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentrosFavoritosPageRoutingModule
  ],
  declarations: [CentrosFavoritosPage]
})
export class CentrosFavoritosPageModule {}
