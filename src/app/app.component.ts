import { Component } from '@angular/core';
// import { Router } from '@angular/router';

import { Platform, MenuController, NavController } from '@ionic/angular';
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

  public appPages: Array<Pages>;
  public appPagesVSAll: Array<Pages>;
  public appPagesTrabajador: Array<Pages>;

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
        url: '/documentos',
        direct: 'root',
        icon: 'calendar'
      },
      {
        title: 'Memoria Anual',
        url: '/messages',
        direct: 'forward',
        icon: 'mail'
      },
      {
        title: 'Estudio Epidemiológico',
        url: '/property-list',
        direct: 'forward',
        icon: 'clipboard'
      },
      {
        title: 'Citas Pendientes',
        url: '/broker-list',
        direct: 'forward',
        icon: 'calendar-outline'
      },
      {
        title: 'Asistencia',
        url: '/nearby',
        direct: 'forward',
        icon: 'help-buoy'
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
        icon: 'lock-closed-outline'
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
