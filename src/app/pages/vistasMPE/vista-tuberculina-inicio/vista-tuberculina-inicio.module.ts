import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaTuberculinaInicioPageRoutingModule } from './vista-tuberculina-inicio-routing.module';

import { VistaTuberculinaInicioPage } from './vista-tuberculina-inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaTuberculinaInicioPageRoutingModule
  ],
  declarations: [VistaTuberculinaInicioPage]
})
export class VistaTuberculinaInicioPageModule {}
