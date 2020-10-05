import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { ViewWillEnter, MenuController, ModalController, Platform, ActionSheetController } from '@ionic/angular';
import { NotificacionesService } from '../../services/notificaciones.service';
import { NotificacionesPage } from 'src/app/pages/vistasMPE/notificaciones/notificaciones.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


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

  private textoCompartirAPP = 'Disfrute de la App de GrupoMPE para la gestión laboral, puede descargarla pinchando en el siguiente enlace!!';
  private urlCompartirAPP = 'http://onelink.to/ept9em';

  constructor(  private usuarioService: UsuarioService,
                private notificacionesService: NotificacionesService,
                private menuCtrl: MenuController,
                private modalCtrl: ModalController,
                private platform: Platform,
                private actionSheetController: ActionSheetController,
                private socialSharing: SocialSharing) { }

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
    console.log('App Header EsGuardiaCivil ', this.usuario.EsGuardiaCivil);
    if(this.usuario.EsGuardiaCivil !== undefined && this.usuario.EsGuardiaCivil.toString() === 'true'){
      this.EsGuardiaCivil = true;
    }else{
      this.EsGuardiaCivil =false;
    }

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


  async compartir() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Compartir APP',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Facebook',
        icon: 'logo-facebook',
        handler: () => {
          console.log('Lanzamos Facebook');
          try {
            this.socialSharing.shareViaFacebook(this.textoCompartirAPP, 'https://mpecronos.com/Documentos/Descarga/icn-app-mpe.jpg', this.urlCompartirAPP).then( () => {
              console.log('Then Lanzamos Facebook');
            }).catch( error => {
              console.log('error Facebook',error);
            });
          } catch (error) {
              this.usuarioService.presentAlert("Error","No tiene instalada la app de FaceBook","");
          }
        }
      }, {
        text: 'Twitter',
        icon: 'logo-twitter',
        handler: () => {
          console.log('Lanzamos Twitter');
          this.socialSharing.shareViaTwitter(this.textoCompartirAPP, 'https://mpecronos.com/Documentos/Descarga/icn-app-mpe.jpg', this.urlCompartirAPP).then( () => {



          }).catch( error => {



          });
        }
      }, {
        text: 'Whatsapp',
        icon: 'logo-whatsapp',
        handler: () => {
          console.log('Lanzamos Whatsapp');
          this.socialSharing.shareViaWhatsApp(this.textoCompartirAPP, 'https://mpecronos.com/Documentos/Descarga/icn-app-mpe.jpg', this.urlCompartirAPP).then( () => {



          }).catch( error => {

            console.log('Lanzamos Whatsapp error',error);

          });
        }
      }, {
        text: 'Email',
        icon: 'mail-outline',
        handler: () => {
          console.log('Lanzamos Email');
          this.socialSharing.shareViaEmail(this.textoCompartirAPP + ':' + this.urlCompartirAPP, 'my subject', null).then( () => {


          }).catch( error => {



          });
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


}
