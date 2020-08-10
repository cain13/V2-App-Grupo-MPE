import { Component, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';

import { Platform, MenuController, NavController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateProvider } from './providers/translate/translate.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

import { Pages } from './interfaces/pages';
import { UsuarioService } from './services/usuario.service';



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
  public Version = "Versión 1.0.1";
  constructor(
    private platform: Platform,
    private menu: MenuController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateProvider,
    private translateService: TranslateService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController
    // public router: Router
  ) {
    this.appPagesTrabajador = [
      {
        title: 'Documentos',
        url: '/documentos-trabajador',
        direct: 'root',
        icon: 'document-outline'
      }
    ];

    this.appPagesVSAll = [
      {
        title: 'Certificado de Aptitud',
        url: '/certificado-aptitud',
        direct: 'root',
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
        title: 'Cerrar Sesion',
        url: '/blanco',
        direct: 'forward',
        icon: 'power-outline'
      }
      /* ,
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
        if(this.usuarioService.getUsuario().Tipo === "CLIENTE"){
          this.navCtrl.navigateRoot('certificado-aptitud');
        }else{
          this.navCtrl.navigateRoot('documentos-trabajador');
        }
      } else{
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

  // goToEditProgile() {
  //   this.router.navigateByUrl('/edit-profile');
  // }

  // logout() {
  //   this.router.navigateByUrl('/login');
  // }
}
