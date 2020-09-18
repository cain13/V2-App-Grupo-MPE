import { Component, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';

import { Platform, MenuController, NavController, IonRouterOutlet, ActionSheetController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateProvider } from './providers/translate/translate.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

import { Pages } from './interfaces/pages';
import { UsuarioService } from './services/usuario.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { DatabaseService } from './services/database.service';
import { Notificacion } from './interfaces/usuario-interfaces';
import { NotificacionesService } from './services/notificaciones.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  lastBack = Date.now();

  public appPages: Array<Pages>;
  public appPagesVSAll: Array<Pages>;
  public appPagesTrabajador: Array<Pages>;
  public appPagesGuardiaCivil: Array<Pages>;
  private textoCompartirAPP = 'Disfrute de la App de GrupoMPE para la gestión laboral, puede descargarla pinchando en el siguiente enlace!!';
  private urlCompartirAPP = 'http://onelink.to/ept9em';

  public Version = 'Versión 1.0.2';
  constructor(
    private platform: Platform,
    private menu: MenuController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateProvider,
    private translateService: TranslateService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private db: DatabaseService,
    private fcm: FCM,
    private notificacionesService: NotificacionesService,
    public actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing
    // public router: Router
  ) {
    this.appPagesTrabajador = [
      {
        title: 'Inicio',
        url: '/tab-inicio',
        direct: 'root',
        icon: 'home-outline'
      },
      {
        title: 'Reconocimientos Médicos',
        url: '/documentos-trabajador',
        direct: 'forward',
        icon: 'document-outline'
      },
      {
        title: 'Documentos COVID',
        url: '/documentos-covid',
        direct: 'forward',
        icon: 'clipboard-outline'
      },
      {
        title: 'Citas Penditenes',
        url: '/citas-pendientes-trabajador',
        direct: 'forward',
        icon: 'timer-outline'
      },
      {
        title: 'Centros Favoritos',
        url: '/favorites',
        direct: 'forward',
        icon: 'heart'
      }

    ];

    this.appPagesGuardiaCivil = [
      {
        title: 'Inicio',
        url: '/tab-inicio',
        direct: 'root',
        icon: 'home-outline'
      },
      {
        title: 'Reconocimientos Médicos',
        url: '/documentos-trabajador',
        direct: 'forward',
        icon: 'document-outline'
      },
      {
        title: 'Pruebas COVID',
        url: '/documentos-covid',
        direct: 'forward',
        icon: 'clipboard-outline'
      },
      {
        title: 'Citas Penditenes',
        url: '/citas-pendientes-trabajador',
        direct: 'forward',
        icon: 'timer-outline'
      },
      {
        title: 'Formularios',
        url: '/test',
        direct: 'forward',
        icon: 'school-outline'
      },
      {
        title: 'Centros Favoritos',
        url: '/favorites',
        direct: 'forward',
        icon: 'heart'
      }

    ];

    this.appPagesVSAll = [
      {
        title: 'Inicio',
        url: '/tab-inicio',
        direct: 'root',
        icon: 'home-outline'
      },
      {
        title: 'Certificado de Aptitud',
        url: '/certificado-aptitud',
        direct: 'forward',
        icon: 'document-outline'
      },
      {
        title: 'Planificación VS',
        url: '/planficacion-vs',
        direct: 'forward',
        icon: 'calendar-outline'
      },
      {
        title: 'Memoria Anual',
        url: '/memoria-anual',
        direct: 'forward',
        icon: 'folder-outline'
      },
      {
        title: 'Estudio Epidemiológico',
        url: '/estudio-epidemiologico',
        direct: 'forward',
        icon: 'flask-outline'
      },
      {
        title: 'Citas Pendientes',
        url: '/citas-pendientes',
        direct: 'forward',
        icon: 'timer-outline'
      },
      {
        title: 'Asistencia',
        url: '/asistencia',
        direct: 'forward',
        icon: 'help-buoy'
      },
      {
        title: 'Historial Documentos',
        url: '/historial-notificaciones',
        direct: 'forward',
        icon: 'clipboard-outline'
      },
      {
        title: 'Centros Favoritos',
        url: '/favorites',
        direct: 'forward',
        icon: 'heart'
      }
    ];

    this.appPages = [
      {
        title: 'Editar Perfil',
        url: '/edit-profile',
        direct: 'forward',
        icon: 'person-outline'
      },
      {
        title: 'Buscar Centro MPE',
        url: '/home-location',
        direct: 'forward',
        icon: 'map-outline'
      } /*,
      {
        title: 'Cerrar Sesion',
        url: '/blanco',
        direct: 'forward',
        icon: 'power-outline'
      },
      ,
      {
        title: 'Centros MPE',
        url: '/property-list',
        direct: 'forward',
        icon: 'home'
      },
      {
        title: 'Contactos',
        url: '/broker-list',
        direct: 'forward',
        icon: 'people'
      },
      {
        title: 'Mapa Centros MPE',
        url: '/nearby',
        direct: 'forward',
        icon: 'compass'
      },
      {
        title: 'Centros MPE',
        url: '/bycategory',
        direct: 'forward',
        icon: 'albums'
      },
      {
        title: 'Documentos',
        url: '/invoices',
        direct: 'forward',
        icon: 'document-outline'
      },
      {
        title: 'Centros Favoritos',
        url: '/favorites',
        direct: 'forward',
        icon: 'heart'
      },
      {
        title: 'Sobre Nosotros',
        url: '/about',
        direct: 'forward',
        icon: 'information-circle-outline'
      },
      {
        title: 'Soporte',
        url: '/support',
        direct: 'forward',
        icon: 'help-buoy'
      },
      {
        title: 'Configuración APP',
        url: '/settings',
        direct: 'forward',
        icon: 'cog'
      },
      {
        title: 'Walkthrough',
        url: '/',
        direct: 'root',
        icon: 'images-outline'
      },
      {
        title: 'Extras',
        url: '/extras',
        direct: 'forward',
        icon: 'newspaper-outline'
      } */
    ];



    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      setTimeout(() => {

        this.fcm.getInitialPushPayload().then(data => {
            console.log('data app closed ', data);
            if (data === undefined || data === null) {
              return;
            }
            console.log('Received app closed: ', data);
            console.log('TipoUsuario ' + data['TipoUsuario']);
            const titulo = data['Titulo'];
            const tipoDocumento = data['TipoDocumento'];
            console.log('TITULO: ', titulo);
            const notificacion: Notificacion = {
              IdNotificacion: 1,
              Fecha: '',
              Titulo: '',
              Mensaje: '',
              Icono: '',
              Leido: 0,
              Ruta: '',
              TipoDocumento: ''
            };

            notificacion.Titulo = titulo;
            notificacion.Leido = 0;
            notificacion.Mensaje = data['Mensaje'];
            notificacion.Fecha = data['FechaNotificacion'];
            notificacion.TipoDocumento = data['TipoDocumento'];

            if (data['TipoUsuario'] !== 'TRABAJADOR') {
              console.log('tipoDocumento.toUpperCase( CLIENTE ) ', tipoDocumento.toUpperCase());
              switch (tipoDocumento.toUpperCase()) {
                case 'DOCUMENTO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/certificado-aptitud';
                  break;
                case 'HISTORICO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/historial-notificaciones';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/certificado-aptitud';
                  break;
              }
            } else {
              console.log('tipoDocumento.toUpperCase( TRABAJADOR ) ', tipoDocumento.toUpperCase());
              switch (tipoDocumento.toUpperCase()) {
                case 'DOCUMENTO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-trabajador';
                  break;
                case 'DOCUMENTO-COVID':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-covid';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/documentos-trabajador';
                  break;
              }
            }

            this.db.addNotificacion(notificacion);
       //  this.db.ModificarRutaNotificacion();
            this.notificacionesService.SumaUnaNotificaciones();
        });


        this.fcm.onNotification().subscribe(data => {
          if (data === undefined || data === null) {
            return;
          }
          if (data.wasTapped) {
            console.log('Received Segundo in background: ', data);
            console.log('Tipo Documento ' + data['TipoDocumento']);
            const titulo = data['Titulo'];
            const tipoDocumento = data['TipoDocumento'];
            console.log('TITULO: ', titulo);
            const notificacion: Notificacion = {
              IdNotificacion: 1,
              Fecha: '',
              Titulo: '',
              Mensaje: '',
              Icono: '',
              Leido: 0,
              Ruta: '',
              TipoDocumento: ''
            };

            notificacion.Titulo = titulo;
            notificacion.Leido = 0;
            notificacion.Mensaje = data['Mensaje'];
            notificacion.Fecha = data['FechaNotificacion'];
            notificacion.TipoDocumento = data['TipoDocumento'];
            if (data['TipoUsuario'] !== 'TRABAJADOR') {
              console.log('tipoDocumento.toUpperCase( CLIENTE ) ', tipoDocumento.toUpperCase());
              switch (tipoDocumento.toUpperCase()) {
                case 'DOCUMENTO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/certificado-aptitud';
                  break;
                case 'HISTORICO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/historial-notificaciones';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/certificado-aptitud';
                  break;
              }
            } else {
              console.log('tipoDocumento.toUpperCase( TRABAJADOR ) ', tipoDocumento.toUpperCase());
              switch (tipoDocumento.toUpperCase()) {
                case 'DOCUMENTO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-trabajador';
                  break;
                case 'DOCUMENTO-COVID':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-covid';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/documentos-trabajador';
                  break;
              }
            }
            this.db.addNotificacion(notificacion);
            this.notificacionesService.SumaUnaNotificaciones();

          } else {
            console.log('Received primer plano: ', data);

            const titulo = data['title'];
            const tipoDocumento = data['TipoDocumento'];
            console.log('TITULO: ', titulo);
            const notificacion: Notificacion = {
              IdNotificacion: 1,
              Fecha: '',
              Titulo: '',
              Mensaje: '',
              Icono: '',
              Leido: 0,
              Ruta: '',
              TipoDocumento: ''
            };

            notificacion.Titulo = titulo;
            notificacion.Leido = 0;
            notificacion.Mensaje = data['body'];
            notificacion.Fecha = data['FechaNotificacion'];
            notificacion.TipoDocumento = data['TipoDocumento'];
            if (data['TipoUsuario'] !== 'TRABAJADOR') {
              console.log('tipoDocumento.toUpperCase( CLIENTE ) ', tipoDocumento.toUpperCase());
              switch (tipoDocumento.toUpperCase()) {
                case 'DOCUMENTO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/certificado-aptitud';
                  break;
                case 'HISTORICO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/historial-notificaciones';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/certificado-aptitud';
                  break;
              }
            } else {
              console.log('tipoDocumento.toUpperCase( TRABAJADOR ) ', tipoDocumento.toUpperCase());
              switch (tipoDocumento.toUpperCase()) {
                case 'DOCUMENTO':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-trabajador';
                  break;
                case 'DOCUMENTO-COVID':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-covid';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/documentos-trabajador';
                  break;
              }
            }
            this.db.addNotificacion(notificacion);
            this.notificacionesService.SumaUnaNotificaciones();
            this.usuarioService.presentAlertNotificaciones('NUEVA NOTIFICACIÓN!!', 'Tiene una notificación nueva!!', '');
          }
        });
        this.statusBar.styleDefault();
        setTimeout(() => {
          this.splashScreen.hide();
        }, 1000);
        // this.splashScreen.hide();
        // Set language of the app.
        this.translateService.setDefaultLang(environment.language);
        this.translateService.use(environment.language);
        this.translateService.getTranslation(environment.language).subscribe(translations => {
          this.translate.setTranslations(translations);
        });
        this.backButtonEvent();
    }, 100);
    }).catch(() => {
      // Set language of the app.
      this.translateService.setDefaultLang(environment.language);
      this.translateService.use(environment.language);
      this.translateService.getTranslation(environment.language).subscribe(translations => {
        this.translate.setTranslations(translations);
      });
    });

    /* this.platform.pause.subscribe(() => {

      if (!this.usuarioService.desactivarSegundoPlano) {
        console.log('PASAMOS A SEGUNDO PLANO');
        this.navCtrl.navigateRoot('');
      }

    });
    this.platform.resume.subscribe(() => {
      console.log('VUELVE A PRIMER PLANO');
    }); */

  }
  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {

      if (this.routerOutlet.canGoBack()) {
        console.log('Vista Fichar');
        if (this.usuarioService.getUsuario().Tipo === 'CLIENTE') {
          this.navCtrl.navigateRoot('certificado-aptitud');
        } else {
          this.navCtrl.navigateRoot('documentos-trabajador');
        }
      } else {
        if (Date.now() - this.lastBack > 500) {
          navigator['app'].exitApp();
        }
        this.lastBack = Date.now();
      }
      this.usuarioService.dismiss();
    });
  }

  closeMenu() {
    this.menu.close();
  }

  async compartirAPP() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Compartir APP',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Facebook',
        icon: 'logo-facebook',
        handler: () => {
          console.log('Lanzamos Facebook');
          this.socialSharing.shareViaTwitter(this.textoCompartirAPP, 'https://mpecronos.com/Documentos/Descarga/icn-app-mpe.jpg', this.urlCompartirAPP).then( () => {



          }).catch( error => {



          });
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
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  cerrarSesion(){
    console.log('Cerrar sesion');
   // this.usuarioService.BorrarEmpleado();
   // this.usuarioService.guardarUsuario(null);
    this.navCtrl.navigateRoot('login');
  }
  // goToEditProgile() {
  //   this.router.navigateByUrl('/edit-profile');
  // }

  // logout() {
  //   this.router.navigateByUrl('/login');
  // }
}
