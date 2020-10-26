import { Component, ViewChild, ɵCodegenComponentFactoryResolver } from '@angular/core';
// import { Router } from '@angular/router';

import { Platform, MenuController, NavController, IonRouterOutlet, ActionSheetController, PopoverController, ViewDidLeave, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateProvider } from './providers/translate/translate.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

import { Pages } from './interfaces/pages';
import { UsuarioService } from './services/usuario.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { DatabaseService } from './services/database.service';
import { Notificacion, UsuarioLogin } from './interfaces/usuario-interfaces';
import { NotificacionesService } from './services/notificaciones.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Tests } from './interfaces/interfaces-grupo-mpe';
import { TestService } from './services/test.service';
import * as moment from 'moment';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  lastBack = Date.now();
  public usuario: UsuarioLogin;
  public appPages: Array<Pages>;
  public appPagesVSAll: Array<Pages>;
  public appPagesTrabajador: Array<Pages>;
  private HayModal = false;
  public appPagesGuardiaCivil: Array<Pages>;
  private textoCompartirAPP = 'Disfrute de la App de GrupoMPE para la gestión laboral, puede descargarla pinchando en el siguiente enlace!!';
/*   private urlCompartirAPP = 'http://onelink.to/ept9em';
 */
  private urlCompartirAPP = 'https://mpeprevencion.com/qr-appmpe.html';
  public Version = 'Versión 1.0.4';

  private notificacion: Notificacion;

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
    private socialSharing: SocialSharing,
    private popoverController: PopoverController,
    private testService: TestService,
    private alertCtrl: AlertController,
    private localNotifications: LocalNotifications
    // public router: Router
  ) {

    this.appPagesTrabajador = [

      {
        title: 'Reconocimientos Médicos',
        url: '/documentos-trabajador-menu',
        direct: 'forward',
        icon: 'document-outline'
      },
      {
        title: 'Documentos COVID',
        url: '/documentos-covid-menu',
        direct: 'forward',
        icon: 'clipboard-outline'
      },
      {
        title: 'Citas Pendientes',
        url: '/citas-pendientes-trabajador-menu',
        direct: 'forward',
        icon: 'timer-outline'
      }

    ];

    this.appPagesGuardiaCivil = [
      {
        title: 'Formularios',
        url: '/test',
        direct: 'forward',
        icon: 'school-outline'
      },
      {
        title: 'Reconocimientos Médicos',
        url: '/documentos-trabajador-menu',
        direct: 'forward',
        icon: 'document-outline'
      },
      {
        title: 'Pruebas de Mantoux',
        url: '/vista-tuberculina-inicio',
        direct: 'forward',
        icon: 'document-text-outline'
      },
      {
        title: 'Pruebas COVID',
        url: '/documentos-covid-menu',
        direct: 'forward',
        icon: 'clipboard-outline'
      },
      {
        title: 'Citas Pendientes',
        url: '/citas-pendientes-trabajador-menu',
        direct: 'forward',
        icon: 'timer-outline'
      },


    ];

    this.appPagesVSAll = [
      {
        title: 'Certificado de Aptitud',
        url: '/certificado-aptitud-menu',
        direct: 'forward',
        icon: 'document-outline'
      },
      {
        title: 'Planificación VS',
        url: '/construccion',
        direct: 'forward',
        icon: 'calendar-outline'
      },
      {
        title: 'Memoria Anual',
        url: '/construccion',
        direct: 'forward',
        icon: 'folder-outline'
      },
      {
        title: 'Estudio Epidemiológico',
        url: '/construccion',
        direct: 'forward',
        icon: 'flask-outline'
      },
      {
        title: 'Citas Pendientes',
        url: '/citas-pendientes-menu',
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
      }
    ];

    this.appPages = [
      {
        title: 'Buscar Centro MPE',
        url: '/home-location',
        direct: 'forward',
        icon: 'map-outline'
      },
      {
        title: 'Centros Favoritos',
        url: '/favorites',
        direct: 'forward',
        icon: 'heart'
      }, {
        title: 'Configuración',
        url: '/edit-profile',
        direct: 'forward',
        icon: 'person-outline'
      }

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

            this.notificacion = notificacion;

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
                case 'MANTOUX':
                    notificacion.Icono = 'medkit-outline';
                    notificacion.Ruta = '/vista-tuberculina-inicio';
                    /* this.db.addNotificacion(notificacion);
                    //  this.db.ModificarRutaNotificacion();
                    this.notificacionesService.SumaUnaNotificaciones(); */
                    this.crearNotificacionesLocalesMantoux(notificacion.Fecha);


                    const fechaPrueba = moment(notificacion.Fecha).format('DD/MM/YYYY');
                    const fecha48h = moment(notificacion.Fecha).add(2, 'days');

                    this.presentAlertTestMantoux('ALERTA', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + fechaPrueba +
                    ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + fecha48h.format('DD/MM/YYYY') + ' y el ' + fecha48h.add(1440, 'minutes').format('DD/MM/YYYY') +
                    ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n' + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.');
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
                  notificacion.Ruta = '/documentos-trabajador-menu';
                  break;
                case 'DOCUMENTO-COVID':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-covid-menu';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                case 'MANTOUX':
                  notificacion.Icono = 'medkit-outline';
                  notificacion.Ruta = '/vista-tuberculina-inicio';
                  this.crearNotificacionesLocalesMantoux(notificacion.Fecha);

                  const fechaPrueba = moment(notificacion.Fecha).format('DD/MM/YYYY');
                  const fecha48h = moment(notificacion.Fecha).add(2, 'days');
                 /*  this.db.addNotificacion(notificacion);
                  //  this.db.ModificarRutaNotificacion();
                  this.notificacionesService.SumaUnaNotificaciones(); */

                  this.presentAlertTestMantoux('ALERTA', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + fechaPrueba +
                  ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + fecha48h.format('DD/MM/YYYY') + ' y el ' + fecha48h.add(1440, 'minutes').format('DD/MM/YYYY') +
                  ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n' + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.');
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/documentos-trabajador-menu';
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

            this.notificacion = notificacion;

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
                case 'MANTOUX':
                  notificacion.Icono = 'medkit-outline';
                  notificacion.Ruta = '/vista-tuberculina-inicio';
                  this.crearNotificacionesLocalesMantoux(notificacion.Fecha);

                  const fechaPrueba = moment(notificacion.Fecha).format('DD/MM/YYYY');
                  const fecha48h = moment(notificacion.Fecha).add(2, 'days');
                  /* this.db.addNotificacion(notificacion);
                  //  this.db.ModificarRutaNotificacion();
                  this.notificacionesService.SumaUnaNotificaciones(); */

                  this.presentAlertTestMantoux('ALERTA', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + fechaPrueba +
                  ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + fecha48h.format('DD/MM/YYYY') + ' y el ' + fecha48h.add(1440, 'minutes').format('DD/MM/YYYY') +
                  ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n' + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.');
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
                  notificacion.Ruta = '/documentos-trabajador-menu';
                  break;
                case 'DOCUMENTO-COVID':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-covid-menu';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                case 'MANTOUX':
                  notificacion.Icono = 'medkit-outline';
                  notificacion.Ruta = '/vista-tuberculina-inicio';
                  this.crearNotificacionesLocalesMantoux(notificacion.Fecha);

                  const fechaPrueba = moment(notificacion.Fecha).format('DD/MM/YYYY');
                  const fecha48h = moment(notificacion.Fecha).add(2, 'days');
                  /* this.db.addNotificacion(notificacion);
                  //  this.db.ModificarRutaNotificacion();
                  this.notificacionesService.SumaUnaNotificaciones();
 */
                  this.presentAlertTestMantoux('ALERTA', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + fechaPrueba +
                  ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + fecha48h.format('DD/MM/YYYY') + ' y el  ' + fecha48h.add(1440, 'minutes').format('DD/MM/YYYY') +
                  ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n' + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.');
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/documentos-trabajador-menu';
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
            notificacion.Mensaje = data['Mensaje'];
            notificacion.Fecha = data['FechaNotificacion'];
            notificacion.TipoDocumento = data['TipoDocumento'];

            this.notificacion = notificacion;

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
                case 'MANTOUX':
                  notificacion.Icono = 'medkit-outline';
                  notificacion.Ruta = '/vista-tuberculina-inicio';
                  this.crearNotificacionesLocalesMantoux(notificacion.Fecha);

                  const fechaPrueba = moment(notificacion.Fecha).format('DD/MM/YYYY');
                  const fecha48h = moment(notificacion.Fecha).add(2, 'days');
/*                   this.db.addNotificacion(notificacion);
                  //  this.db.ModificarRutaNotificacion();
                  this.notificacionesService.SumaUnaNotificaciones(); */

                  this.presentAlertTestMantoux('ALERTA', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + fechaPrueba +
                  ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + fecha48h.format('DD/MM/YYYY') + ' y el ' + fecha48h.add(1440, 'minutes').format('DD/MM/YYYY') +
                  ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n' + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.');
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
                  notificacion.Ruta = '/documentos-trabajador-menu';
                  break;
                case 'DOCUMENTO-COVID':
                  notificacion.Icono = 'document-text-outline';
                  notificacion.Ruta = '/documentos-covid-menu';
                  break;
                case 'MENSAJE':
                  notificacion.Icono = 'mail-outline';
                  notificacion.Ruta = '/message/';
                  break;
                case 'MANTOUX':
                  notificacion.Icono = 'medkit-outline';
                  notificacion.Ruta = '/vista-tuberculina-inicio';
                  this.crearNotificacionesLocalesMantoux(notificacion.Fecha);

                  const fechaPrueba = moment(notificacion.Fecha).format('DD/MM/YYYY');
                  const fecha48h = moment(notificacion.Fecha).add(2, 'days');
                  /* this.db.addNotificacion(notificacion);
                  //  this.db.ModificarRutaNotificacion();
                  this.notificacionesService.SumaUnaNotificaciones(); */

                  this.presentAlertTestMantoux('ALERTA', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + fechaPrueba +
                  ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + fecha48h.format('DD/MM/YYYY') + ' y el ' + fecha48h.add(1440, 'minutes').format('DD/MM/YYYY') +
                  ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n' + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.');
                  break;
                default:
                  notificacion.Icono = 'alert-circle-outline';
                  notificacion.Ruta = '/documentos-trabajador-menu';
                  break;
              }
            }
            this.db.addNotificacion(notificacion);
            this.notificacionesService.SumaUnaNotificaciones();
            if (tipoDocumento.toUpperCase() !== 'MANTOUX') {
              this.usuarioService.presentAlertNotificaciones('NUEVA NOTIFICACIÓN!!', 'Tiene una notificación nueva!!', '');
            }
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
    this.platform.backButton.subscribeWithPriority(0, async () => {
      await this.CerrarPopoOvr();
      if (this.routerOutlet.canGoBack()) {
        console.log('Vista Fichar');
        if (this.testService.getTest() !== null && this.testService.getTest() !== undefined && this.testService.getTest().Preguntas !== null && this.testService.getTest().Preguntas !== undefined) {
          console.log('this.testService.respuestasMarcadas out ', this.testService.respuestasMarcadas);
          console.log('this.testService.getTest().Preguntas.PreguntaInfo.length out ', this.testService.getTest().Preguntas.PreguntaInfo.length);
          if (this.testService.respuestasMarcadas < this.testService.getTest().Preguntas.PreguntaInfo.length) {
            console.log('this.testService.respuestasMarcadas in ', this.testService.respuestasMarcadas);
            console.log('this.testService.getTest().Preguntas.PreguntaInfo.length in ', this.testService.getTest().Preguntas.PreguntaInfo.length);
            this.presentAlertSalirTest('Atención!', '', 'Si sale perdera las respuesta del test');
          }
        } else {
          this.navCtrl.navigateRoot('tab-inicio');
        }

      } else {
        await this.CerrarPopoOvr();
        if (this.HayModal === false && Date.now() - this.lastBack > 500) {
            this.closeMenu();
/*          navigator['app'].exitApp();
 */        }
        this.lastBack = Date.now();
      }
      this.usuarioService.dismiss();
    });
  }
  async CerrarPopoOvr() {
    const popover = await this.popoverController.getTop();
        if (popover) {
            this.HayModal = true;
            popover.dismiss();
        } else {
          this.HayModal = false;
        }
       // this.navCtrl.navigateRoot('/tab-inicio');
  }
  closeMenu() {
    this.usuarioService.presentAlertSalir('Información', '', '¿Quieres usted salir de la aplicación?');
    // this.menu.close();
    // navigator['app'].exitApp();
  }

  inicioMenu() {
    this.navCtrl.navigateRoot('tab-inicio');
  }

  async presentAlertSalirAppTest(titulo: string, subtitulo: string, mensaje: string): Promise<boolean>  {
    console.log('presentAlert');
    const alerta = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Continuar',
          handler: (blah) => {
            console.log('Lanzamos NO');

          }
        }, {
          text: 'Salir',
          handler: () => {
            const navTransition = alerta.dismiss();

            this.someAsyncOperation().then(() => {
              console.log('someAsyncOperation');
              navTransition.then(() => {
                console.log('navTransition.then');
                this.testService.testSelec = null;
                this.testService.respuestasMarcadas = 0;
                this.navCtrl.navigateRoot('tab-inicio');
              });
            });
            return false;
          }
        }
      ]
    });

    await alerta.present();
    return null;
  }

  async presentAlertSalirTest(titulo: string, subtitulo: string, mensaje: string): Promise<boolean>  {
    console.log('presentAlert');
    const alerta = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Continuar',
          handler: (blah) => {
            console.log('Lanzamos NO');

          }
        }, {
          text: 'Salir',
          handler: () => {
            const navTransition = alerta.dismiss();

            this.someAsyncOperation().then(() => {
              console.log('someAsyncOperation');
              navTransition.then(() => {
                console.log('navTransition.then');
                this.testService.testSelec = null;
                this.testService.respuestasMarcadas = 0;
                this.navCtrl.navigateRoot('tab-inicio');
              });
            });
            return false;
          }
        }
      ]
    });

    await alerta.present();
    return null;
  }
  async someAsyncOperation() {
    // await this.navController.navigateForward("/test");
  }



  async presentAlertTestMantoux(titulo: string, subtitulo: string, mensaje: string): Promise<boolean>  {
    console.log('presentAlert');
    const cerrar = false;
    const alerta = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ver más tarde',
          handler: (blah) => {
            console.log('Lanzamos ver mas tarde');

          }
        }, {
          text: 'Ver ahora',
          handler: () => {
            const navTransition = alerta.dismiss();
            if (this.usuario !== undefined && this.usuario != null && this.usuario.RequiereMantoux !== undefined && this.usuario.RequiereMantoux != null ) {
              this.usuario.HacerMantoux = true;
              this.usuario.FechaMantoux = moment(this.notificacion.Fecha).locale('es').format().toString();
              console.log('FECHA USUARIO: ', this.usuario.FechaMantoux);
              console.log('Fecha fecha: ' , moment().locale('es').format().toString());
              this.usuarioService.actualizarPerfil(this.usuario);
              this.usuarioService.guardarUsuario(this.usuario);
            } else {
              this.usuario = this.usuarioService.getUsuario();
              this.usuario.HacerMantoux = true;
              this.usuario.FechaMantoux = moment(this.notificacion.Fecha).locale('es').format().toString();
              console.log('FECHA USUARIO: ', this.usuario.FechaMantoux);
              console.log('Fecha fecha: ' , moment().locale('es').format().toString());
              this.usuarioService.actualizarPerfil(this.usuario);
              this.usuarioService.guardarUsuario(this.usuario);
            }
            this.someAsyncOperation().then(() => {
              console.log('someAsyncOperation');
              navTransition.then(() => {
                console.log('navTransition.then');
                this.navCtrl.navigateForward('/vista-tuberculina-inicio');
              });
            });
            return false;
          }
        }
      ]
    });

    await alerta.present();

    return null;
  }

  async compartirAPP() {
    try {
    const actionSheet = await this.actionSheetController.create({
      header: 'Compartir APP',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Facebook',
        icon: 'logo-facebook',
        handler: () => {
          console.log('Lanzamos Facebook');
            // Sharing via email is possible
            this.socialSharing.shareViaFacebook('https://mpeprevencion.com/qr-appmpe.html', null, null).then( () => {
              console.log('Then Lanzamos Facebook');
            }).catch( error => {
              console.log('error Facebook', error);
            });
        }
      }, {
        text: 'Twitter',
        icon: 'logo-twitter',
        handler: () => {
          console.log('Lanzamos Twitter');
          this.socialSharing.shareViaTwitter(this.textoCompartirAPP, 'https://mpecronos.com/Documentos/Descarga/icn-app-mpe.jpg', this.urlCompartirAPP).then( () => {



          }).catch( error => {
            console.log('Lanzamos Twitter error', error);
            this.usuarioService.presentAlert('Error', 'No tiene la app de Twitter en su móvil', 'Descarguela y pruebe de nuevo, gracias.');

            });
          }
        }, {
          text: 'Whatsapp',
          icon: 'logo-whatsapp',
          handler: () => {
            console.log('Lanzamos Whatsapp');
            this.socialSharing.shareViaWhatsApp(this.textoCompartirAPP, 'https://mpecronos.com/Documentos/Descarga/icn-app-mpe.jpg', this.urlCompartirAPP).then( () => {



            }).catch( error => {

            console.log('Lanzamos Whatsapp error', error);
            this.usuarioService.presentAlert('Error', 'No tiene la app de Whatsapp en su móvil', 'Descarguela y pruebe de nuevo, gracias.');


          });
        }
      }, {
        text: 'Email',
        icon: 'mail-outline',
        handler: () => {
          console.log('Lanzamos Email');
          this.socialSharing.shareViaEmail(this.textoCompartirAPP + ':' + this.urlCompartirAPP, 'Descarga la App de prevención de Grupo MPE', null).then( () => {


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
    } catch (error) {
        console.log('Fallo al cargar ');
    }
  }

  editarPerfil() {
    this.navCtrl.navigateForward('edit-profile');
  }

  contactoMpe() {
    this.navCtrl.navigateForward('contacto-mpe');
  }

  proteccionGuardiaCivil() {
    window.open('https://mpeprevencion.com/proteccion_datos_GuardiaCivil.html', '_system');
  }



  proteccionGenerico() {
    window.open('https:mpeprevencion.com/proteccion_datos_MPE.html', '_system');

  }

  terminosCondiciones() {

    window.open('https://mpeprevencion.com/terminos-condiciones.html', '_system');

  }

  cerrarSesion() {
    this.usuarioService.presentAlertCerrarSesion('Información', '', '¿Quieres usted salir de la aplicación?');
  }

  crearNotificacionesLocalesMantoux(fecha: string) {
    const fechaPrueba = moment(fecha);
    console.log('fecha notificacion: ', fecha);
    const fecha48h = moment(fechaPrueba.add(48, 'hours'));
    for (let i = 0; i < 4; i++) {
      switch (i) {
        case 0:
          // tslint:disable-next-line: no-shadowed-variable
          const notificacionHora8 = fecha48h.format('L') + ' 08:00';
          console.log('notificacionHora8:' , moment(notificacionHora8).format());
          const fechaNot0 = new Date(notificacionHora8);
          console.log('FICHAPRUEBA:', fechaNot0);

          if (fecha48h < moment(notificacionHora8)) {
            this.localNotifications.schedule({
              title: 'Recuerde: Prueba Médica Mantoux',
              text: 'Le recordamos que durante el día de hoy debe realizarse la fotografía para su diagnóstico de la prueba de Mantoux',
              trigger: { at: fechaNot0, count: 365 }
            });


          } else {

            console.log('No creamos la notificación porque se hizo la prueba despues de las 8:00 de la mañana.');

          }
          break;

        case 1:
          const notificacionHora11 = fecha48h.format('L') + '11:00';
          console.log('notificacionHora11:' , moment(notificacionHora11).format());
          const fechaNot1 = new Date(notificacionHora11);
          console.log('FICHAPRUEBA:', fechaNot1);

          if (fecha48h < moment(notificacionHora11)) {

            this.localNotifications.schedule({
              title: 'Recuerde: Prueba Médica Mantoux',
              text: 'Le recordamos que durante el día de hoy debe realizarse la fotografía para su diagnóstico de la prueba de Mantoux',
              trigger: { at: fechaNot1, count: 365 }
            });


          } else {

            console.log('No creamos la notificación porque se hizo la prueba despues de las 8:00 de la mañana.');

          }

          break;

        case 2:
          const notificacionHora14 = fecha48h.format('L') + ' 14:00';
          console.log('notificacionHora14:' , moment(notificacionHora14).format());
          const fechaNot2 = new Date(notificacionHora14);
          console.log('FICHAPRUEBA:', fechaNot2);

          if (fecha48h < moment(notificacionHora14)) {

            this.localNotifications.schedule({
              title: 'Recuerde: Prueba Médica Mantoux',
              text: 'Le recordamos que durante el día de hoy debe realizarse la fotografía para su diagnóstico de la prueba de Mantoux',
              trigger: { at: fechaNot2, count: 365 }
            });


          } else {

            console.log('No creamos la notificación porque se hizo la prueba despues de las 8:00 de la mañana.');

          }
          break;

        case 3:
          const notificacionHora17 = fecha48h.format('L') + ' 17:00';
          console.log('notificacionHora17:' , moment(notificacionHora17).format());
          const fechaNot3 = new Date(notificacionHora17);
          console.log('FICHAPRUEBA:', fechaNot3);

          if (fecha48h < moment(notificacionHora17)) {
            this.localNotifications.schedule({
              title: 'Recuerde: Prueba Médica Mantoux',
              text: 'Le recordamos que durante el día de hoy debe realizarse la fotografía para su diagnóstico de la prueba de Mantoux',
              trigger: { at: fechaNot3, count: 365 }
            });


          } else {

            console.log('No creamos la notificación porque se hizo la prueba despues de las 8:00 de la mañana.');

          }
          break;

        default:
          console.log('Caso null');
        break;
      }

    }
  }

  // goToEditProgile() {
  //   this.router.navigateByUrl('/edit-profile');
  // }

  // logout() {
  //   this.router.navigateByUrl('/login');
  // }
}
