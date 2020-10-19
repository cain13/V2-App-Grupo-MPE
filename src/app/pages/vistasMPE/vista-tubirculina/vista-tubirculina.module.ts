import { NgModule } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { FormsModule } from '@angular/forms';

 import { IonicModule } from '@ionic/angular';

 import { VistaTubirculinaPageRoutingModule } from './vista-tubirculina-routing.module';

 import { VistaTubirculinaPage } from './vista-tubirculina.page';

 @NgModule({
   imports: [
     CommonModule,
     FormsModule,
     IonicModule,
     VistaTubirculinaPageRoutingModule
   ],
   declarations: [VistaTubirculinaPage]
 })
 export class VistaTubirculinaPageModule {}