import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonRouterOutlet, MenuController, ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Noticia, ObtenerDatosConsultorResult, RespuestaAPIGetDatos, RespuestaAPINoticias } from 'src/app/interfaces/interfaces-grupo-mpe';
import { UsuarioLogin, EmpresaConsultor } from 'src/app/interfaces/usuario-interfaces';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotificacionesPage } from '../notificaciones/notificaciones.page';
import { NgxXml2jsonService } from 'ngx-xml2json';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { ModalCondicionesPage } from '../modal-condiciones/modal-condiciones.page';
import { PopoverAvisarEditPerfilComponent } from '../../../components/popover-avisar-edit-perfil/popover-avisar-edit-perfil.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class InicioPage implements OnInit {

  usuario: UsuarioLogin;
  empresaCoonsultor: EmpresaConsultor;
  hayConsultor = false;
  Cantidad = 0;
  cantidad$: Observable<number>;
  isSmallPhone = false;
  header = new HttpHeaders().set('Content-Type', 'application/json');
  noticias: Noticia[];
  promociones: Noticia[];
  imagenDestacada: Noticia = {
    IdNoticia: 9999,
    Descripcion:      'imagen destacada',
    Titulo:           '',
    Url:              '',
    PathImagen:       'https://mpecronos.com/Documentos/imagenesMPE/promo.png',
    DescripcionCorta: '',
    TipoNoticia:      '',
    TipoEmpleado:     '',
    FechaInicio:      '',
    FechaFin:         '',
    URLYoutube:       '',
  };
  soportaFingerID: any;
  checkFinger: any;
  botonHuella: any;
  checkRemember: any;
  botonRecordarme: any;
  onLoginForm: any;
  hayCondiciones = false;

  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  lastBack = Date.now();

  constructor(  private usuarioService: UsuarioService,
                public menuCtrl: MenuController,
                public navCtrl: NavController,
                public modalCtrl: ModalController,
                private http: HttpClient,
                private ngxXml2jsonService: NgxXml2jsonService,
                private popoverController: PopoverController
    ) {
    this.usuario = this.usuarioService.getUsuario();
  }

  async ngOnInit() {
   // console.log('this.usuarioService.getLogin(): ', this.usuarioService.getLogin());
   // console.log('!this.usuarioService.terminosOK: ', !this.usuarioService.getTerminos());
    /*
    if (this.usuarioService.getLogin() && !this.usuarioService.getTerminos()) {
      if (this.usuario.EsGuardiaCivil !== undefined && this.usuario.EsGuardiaCivil.toString() === 'true') {
        this.hayCondiciones = true;
        await this.condiciones();
      }
    }
    */
   this.CerrarPopoOvr();
    // tslint:disable-next-line: max-line-length
    if (this.usuario.EsGuardiaCivil !== undefined && this.usuario.EsGuardiaCivil.toString() === 'true' && this.usuario.RecordarEditarPerfil.toString() === 'true' && this.hayCondiciones !== true && (this.usuario.Movil === null || this.usuario.Email === null || this.usuario.Telefono === null)) {

      await this.recordarEditPerfil();

    }

    await this.usuarioService.present('Cargando datos...');

    await this.getNoticias().then( resp => {
      console.log('ACTUALIZAMOS DATOS BD... ');
      this.getDatosLogin();
      if (resp.Respuesta === 'OK') {
        console.log(resp);
        console.log('NOTICIAS resp: ', resp.Noticias);
        console.log('NOTICIAS resp : ', resp.Promocion);
        console.log('NOTICIAS: ', resp.Respuesta);
        if (resp.ImagenDestacada !== undefined) {
          this.imagenDestacada = resp.ImagenDestacada;
        }
        this.noticias = resp.Noticias;
        this.promociones = resp.Promocion;
        console.log('NOTICIAS THIS: ', this.noticias);
        console.log('PROMOCIONES THIS : ', this.promociones);

      } else {

        this.usuarioService.presentAlert('ERROR', 'Fallo al cargar la información de inico', 'Intentelo de nuevo más tarde');
        console.log(resp);
      }
      this.usuarioService.dismiss();

    }).catch( error => {
      console.log(error);
      this.usuarioService.presentAlert('ERROR', 'Fallo al cargar la información de inico', 'Intentelo de nuevo más tarde');
      this.usuarioService.dismiss();
    });


  }

  ionViewWillEnter() {
    this.CerrarPopoOvr();
    this.usuario = this.usuarioService.getUsuario();
    console.log('Cantidad$ Notificacioens: ', this.Cantidad);
    this.menuCtrl.enable(true);
  
  }

  async CerrarPopoOvr() {
    const popover = await this.popoverController.getTop();
        if (popover) {
            popover.dismiss();
        }
       // this.navCtrl.navigateRoot('/tab-inicio');
  }

  async notifications() {
    const modal = await this.modalCtrl.create({
      component: NotificacionesPage
        });
    return await modal.present();
  }

  async condiciones() {
    const modal = await this.modalCtrl.create({
      component: ModalCondicionesPage
        });

    modal.onDidDismiss().then( async () => {
      await this.recordarEditPerfil();

    });
    return await modal.present();

  }


  async recordarEditPerfil() {
    const popover = await this.popoverController.create({
      component: PopoverAvisarEditPerfilComponent,
      animated: true,
      showBackdrop: true,
      backdropDismiss: true,
    });

    return await popover.present();


  }

  async getNoticias(): Promise <RespuestaAPINoticias> {
    // tslint:disable-next-line: no-shadowed-variable
    const URL = 'https://mpecronos.com/api/apiMpe/GetNoticiasMpe';

    const usuario = {

      Empleado: this.usuario.Tipo

    };
    if (this.usuario.EsGuardiaCivil !== undefined && this.usuario.EsGuardiaCivil.toString() === 'true') {
      console.log('GuardiaCivil Inicio ', this.usuario.EsGuardiaCivil);
      usuario.Empleado = 'GuardiaCivil';
    }
    const respuesta = await  this.http.post<RespuestaAPINoticias>(URL, usuario, {headers: this.header}).toPromise();

    return respuesta;

  }

  masInfo(not: Noticia) {

    const navigationExtras: NavigationExtras = {
      queryParams: {
        noticia: JSON.stringify(not)
      }
    };

   this.navCtrl.navigateForward('/noticias-mas-info', navigationExtras);

  }

  getDatosLogin() {
    try {
      const xmlhttp = new XMLHttpRequest();
      console.log('ACTUALIZAMOS DATOS BD 1... ');

      xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
      xmlhttp.setRequestHeader('content-type', 'text/xml');

      xmlhttp.responseType = 'document';
        // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
      const sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap:Header>' +
            '<AuthHeader xmlns="http://tempuri.org/">' +
              '<Usuario>' + this.usuario.Usuario + '</Usuario>' +
              '<Password>' + this.usuario.Password + '</Password>' +
            '</AuthHeader>' +
          '</soap:Header>' +
          '<soap:Body>' +
            '<ObtenerDatosConsultor xmlns="http://tempuri.org/" />' +
          '</soap:Body>' +
        '</soap:Envelope>';

     xmlhttp.onreadystatechange = () => {

      console.log('XMLHTTP: ', xmlhttp);

            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    console.log('xml... ', xml);
      
                    const obj: RespuestaAPIGetDatos = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    console.log('obj: ', obj);
                    // tslint:disable-next-line: max-line-length
                    const a: ObtenerDatosConsultorResult = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerDatosConsultorResponse']['ObtenerDatosConsultorResult']));


                    // tslint:disable-next-line: no-shadowed-variable
                    const usuario: UsuarioLogin = {
                      Usuario: this.usuario.Usuario,
                      Password: this.usuario.Password,
                      FingerID: this.usuario.FingerID,
                      Nombre: a.Nombre,
                      Tipo: a.Tipo,
                      Recordarme:  this.usuario.Recordarme,
                      EsBuzo: a.EsBuzo,
                      EsGuardiaCivil: a.EsGuardiaCivil,
                      RequiereMantoux: a.RequiereMantoux,
                      Email: a.Email,
                      Movil: a.Movil,
                      Telefono: a.Telefono,
                      RecordarEditarPerfil: this.usuario.RecordarEditarPerfil
                    };

                    if (a.Tests !== null && a.Tests !== undefined) {

                      for ( let test of a.Tests.EstadoTestInfo ) {

                        if ( test.HacerTest.toString() === 'true' ) {

                          this.usuarioService.presentAlertTest('Aviso', '', 'Por favor rellene el formulario personalizado previo a la realización de su reconocimiento médico.');

                        }

                      }

                    }

                    this.usuarioService.login(usuario);
                    this.usuarioService.guardarUsuario(usuario);

                } else if (xmlhttp.status === 500 ) {
                  this.presentAlert('Error al actualizar los datos', '');
                }
            }
        };
      xmlhttp.send(sr);
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  guardarTokenAPI(Tipo: string) {
    throw new Error('Method not implemented.');
  }
  getCentros() {
    throw new Error('Method not implemented.');
  }
  searchFilter() {
    throw new Error('Method not implemented.');
  }
  presentAlert(arg0: string, arg1: string) {
    throw new Error('Method not implemented.');
  }



}
