import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { PopoverElegirTestV2Component } from './popover-elegir-test-v2/popover-elegir-test-v2.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificacionesPage } from '../pages/vistasMPE/notificaciones/notificaciones.page';
import { NotificacionesPageModule } from '../pages/vistasMPE/notificaciones/notificaciones.module';
import { PopoverAvisarEditPerfilComponent } from './popover-avisar-edit-perfil/popover-avisar-edit-perfil.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent
  }
];

@NgModule({
  declarations: [
    HeaderComponent,
    PopoverElegirTestV2Component,
    PopoverAvisarEditPerfilComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule,
    NotificacionesPageModule,
    FormsModule,

  ],
  exports: [
    HeaderComponent,
    PopoverElegirTestV2Component,
    PopoverAvisarEditPerfilComponent
  ],
  entryComponents: [
    NotificacionesPage
  ]

})
export class ComponentsModule { }
