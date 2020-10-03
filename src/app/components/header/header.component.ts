import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { ViewWillEnter, MenuController, ModalController, Platform } from '@ionic/angular';
import { NotificacionesService } from '../../services/notificaciones.service';
import { NotificacionesPage } from 'src/app/pages/vistasMPE/notificaciones/notificaciones.page';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, ViewWillEnter {
  usuario: UsuarioLogin;
  cantidad = 0;
  cantidad$: Observable<number>;
  isSmallPhone = false;

  EsGuardiaCivil = false;

  @Input() titulo: string = 'Grupo MPE';



  constructor(  private usuarioService: UsuarioService,
                private notificacionesService: NotificacionesService,
                private menuCtrl: MenuController,
                private modalCtrl: ModalController,
                private platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      console.log('Width: ' + this.platform.width());
      console.log('Height: ' + this.platform.height());
      if (this.platform.width() > 360) {
        this.isSmallPhone = true;
        console.log('Si es movil pequeño');

      } else {
        this.isSmallPhone = false;
        console.log('No es movil pequeño');

      }
    });
    this.usuario = this.usuarioService.getUsuario();
    this.EsGuardiaCivil = this.usuario.EsGuardiaCivil;

  }

  ionViewWillEnter() {
    this.notificacionesService.aumentarNotificaciones();
    this.cantidad$ = this.notificacionesService.getNotifiaciones$();
    this.cantidad$.subscribe(num => this.cantidad = num);
    console.log('Cantidad$ Notificacioens: ', this.cantidad);
    this.menuCtrl.enable(true);
  }

  async notifications() {
    const modal = await this.modalCtrl.create({
      component: NotificacionesPage
        });
    return await modal.present();
  }


}
