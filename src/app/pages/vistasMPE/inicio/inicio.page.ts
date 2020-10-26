import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonRouterOutlet, MenuController, ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DatosMantoux, Noticia, ObtenerDatosConsultorResult, ObtenerResultadoTestMantouxResult, RespuestaAPIGetDatos, RespuestaAPINoticias, RespuestAPIMantoux, RespuestaTestMantouxInfo } from 'src/app/interfaces/interfaces-grupo-mpe';
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
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

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

  datosMantoux: ObtenerResultadoTestMantouxResult;

  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  lastBack = Date.now();

  constructor(  private usuarioService: UsuarioService,
                public menuCtrl: MenuController,
                public navCtrl: NavController,
                public modalCtrl: ModalController,
                private http: HttpClient,
                private ngxXml2jsonService: NgxXml2jsonService,
                private popoverController: PopoverController,
                private localNotifications: LocalNotifications
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
      this.usuarioService.presentAlert('ERROR', 'Fallo al cargar la información de inico', 'Compruebe su conexión a internet');
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
                      RecordarEditarPerfil: this.usuario.RecordarEditarPerfil,
                      HacerMantoux: this.usuario.HacerMantoux,
                      FechaMantoux: this.usuario.FechaMantoux
                    };

                    if (a.Tests !== null && a.Tests !== undefined) {

                      for ( const test of a.Tests.EstadoTestInfo ) {

                        if ( test.HacerTest.toString() === 'true' ) {

                          this.usuarioService.presentAlertTest('Aviso', '', 'Por favor rellene el formulario personalizado previo a la realización de su reconocimiento médico.');

                        }

                      }

                    }

                    if (a.RequiereMantoux !== null && a.RequiereMantoux !== undefined) {
                      if ( a.RequiereMantoux.toString() === 'true') {

                        this.getDatosMantoux(usuario);

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

  getDatosMantoux(usuario: UsuarioLogin) {
    try {
      const xmlhttp = new XMLHttpRequest();
      console.log('COGEMOS DATOS MANTOUX... ');

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
            '<ObtenerResultadoTestMantoux  xmlns="http://tempuri.org/" />' +
          '</soap:Body>' +
        '</soap:Envelope>';

     xmlhttp.onreadystatechange = () => {

      console.log('XMLHTTP: ', xmlhttp);

            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    console.log('xml... ', xml);

                    const obj: RespuestAPIMantoux = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    console.log('obj: ', obj);
                    // tslint:disable-next-line: max-line-length
                    const a: ObtenerResultadoTestMantouxResult = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerResultadoTestMantouxResponse']['ObtenerResultadoTestMantouxResult']['ResultadoTestMantouxInfo']));
                    if (a.DatosMantoux !== null && a.DatosMantoux !== undefined) {
                      console.log('a.DatosMantoux: ', a.DatosMantoux);
                      console.log('a.DatosMantoux es ARRAY?: ', Array.isArray(a.DatosMantoux));

                      if (!Array.isArray(a.DatosMantoux.RespuestaTestMantouxInfo)) {
                        console.log('EL ARRAY DE OBJETOS TIENE SOLO 1 OBJETO...');

                        console.log('a.DatosMantoux: ', a.DatosMantoux);
                        const aux: any = [];
                        aux.push(a.DatosMantoux.RespuestaTestMantouxInfo);

                        // SI EL USUARIO REQUIERE TEST MANTOUX, TIENE FECHA DE INOCULACIÓN PERO NO TIENE FOTO HECHA
                        if (this.isObject(aux[0].FechaFoto)) {

                          // COMPROBAMOS QUE LA FECHA DE INOCULACIÓN NO ES MAYOR A 72 HORAS
                          const fechaAUX = moment(aux[0].FechaInoculacion);
                          const fecha48h = moment(aux[0].FechaInoculacion).add(2, 'days');
                          const fecha72h = moment(aux[0].FechaInoculacion).add(3, 'days');
                          const fechaActual = moment();
                          console.log('FECHA INOCULACION: ', aux[0].FechaInoculacion);
                          console.log('FECHA HOY: ', fechaActual);
                          console.log('FECHA AUX: ', fechaAUX.format('MMMM Do YYYY, h:mm:ss a'));
                          console.log('FECHA 48H: ', fecha48h.format('MMMM Do YYYY, h:mm:ss a'));
                          console.log('FECHA 72H: ', fecha72h.format('MMMM Do YYYY, h:mm:ss a'));

                          if (fechaAUX < moment('2000-01-01T00:00:00')) {

                            console.log('NO HACEMOS NADA YA NO SE HA INOCULADO AUN: 1900-01-01T00:00:00: ', fechaAUX);

                          } else {
                            console.log('aux[0] ', aux[0]);
                            console.log('aux[0]: ', this.tieneResultado(aux[0]));

                            if (fechaActual < fecha72h && !this.tieneResultado(aux[0])) {
                              // COMPROBAMOS QUE LA FECHA DE INOCULACIÓN NO ES MENOR A 48 HORAS

                                console.log('ENTRAMOS PORQUE LA FECHA ES MENOR A 72h');

                                if (fechaActual > fecha48h) {
                                  if (this.usuario.FechaMantoux !== null  && this.usuario.FechaMantoux !== undefined && this.usuario.FechaMantoux !== aux[0].FechaInoculacion) {
                                    console.log('CREAMOS NOTIFICACIONES PORQUE NO SE HABIAN CREADO: ', this.usuario.FechaMantoux);
                                    this.crearNotificacionesLocalesMantoux(aux[0].FechaInoculacion);
                                    this.usuarioService.presentAlertTestMantouxBotones('ALERTA', 'Le recordamos, que se encuentra dentro del plazo para realizar su prueba Mantoux, y solo dispone hasta el dia ' +
                                    fecha72h + ' para realizarsela.', '', aux[0].FechaInoculacion);
                                  } else {
                                    this.usuario.HacerMantoux = true;
                                    this.usuario.FechaMantoux = moment(fechaAUX).locale('es').format().toString();
                                    console.log('FECHA USUARIO: ', this.usuario.FechaMantoux);
                                    console.log('Fecha fecha: ' , moment().locale('es').format().toString());
                                    this.usuarioService.actualizarPerfil(this.usuario);
                                    this.usuarioService.guardarUsuario(this.usuario);
                                    this.usuarioService.presentAlert('ALERTA', 'Le recordamos, que se encuentra dentro del plazo para realizar su prueba Mantoux, y solo dispone hasta el dia ' +
                                    fecha72h + ' para realizarsela.', '');

                                  }
                                } else {
                                  if (this.usuario.FechaMantoux !== null  && this.usuario.FechaMantoux !== undefined && this.usuario.FechaMantoux !== aux[0].FechaInoculacion) {

                                    this.crearNotificacionesLocalesMantoux(aux[0].FechaInoculacion);
                                    this.usuarioService.presentAlertTestMantoux('RECUERDE', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + aux[0].FechaInoculacion +
                                    ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + moment(aux[0].FechaInoculacion).format('DD/MM/YYYY') + ' y el ' +
                                    moment(aux[0].FechaInoculacion).add(1440, 'minutes').format('DD/MM/YYYY') + ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n'
                                    + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.', aux[0].FechaInoculacion);

                                  } else {
                                    this.usuario.HacerMantoux = true;
                                    this.usuario.FechaMantoux = moment(fechaAUX).locale('es').format().toString();
                                    console.log('FECHA USUARIO: ', this.usuario.FechaMantoux);
                                    console.log('Fecha fecha: ' , moment().locale('es').format().toString());
                                    this.usuarioService.actualizarPerfil(this.usuario);
                                    this.usuarioService.guardarUsuario(this.usuario);
                                    this.usuarioService.presentAlert('RECUERDE', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + aux[0].FechaInoculacion +
                                    ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + moment(aux[0].FechaInoculacion).format('DD/MM/YYYY') + ' y el ' +
                                    moment(aux[0].FechaInoculacion).add(1440, 'minutes').format('DD/MM/YYYY') + ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n'
                                    + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.');

                                  }
                                }

                              } else {
                                if (!this.tieneResultado(aux[0])) {
                                  this.usuario.HacerMantoux = true;
                                  this.usuario.FechaMantoux = moment(fechaAUX).locale('es').format().toString();
                                  console.log('FECHA USUARIO: ', this.usuario.FechaMantoux);
                                  console.log('Fecha fecha: ' , moment().locale('es').format().toString());
                                  this.usuarioService.actualizarPerfil(this.usuario);
                                  this.usuarioService.guardarUsuario(this.usuario);
                                  this.usuarioService.presentAlertNoTestMontoux('Alerta', 'Vd. No puede realizar la prueba ya que se encuentra fuera de plazo',
                                  'Su plazo ha expirado ya que han pasado mas de 72h desde su inoculación y' +
                                  'no ha procedido a la realización de la fotografía para su diagnóstico, dicha prueba se considera invalida sin ninguna responsabilidad para Grupo MPE');

                                }}

                          }

                        } else {

                          console.log('NO HACEMOS NADA YA QUE YA TIENE FECHA DE INOCULACIÓN Y FECHA DE FOTO');

                        }

                      } else {

                        console.log('EL ARRAY DE OBJETOS TIENE MÁS DE 1 OBJETO...');
                        const arrayDatos = a.DatosMantoux.RespuestaTestMantouxInfo;
                        console.log('arrayDatos: ', arrayDatos);
                        arrayDatos.sort(function (ax , b) {
                          return (new Date(b.FechaFoto).valueOf() - new Date(ax.FechaFoto).valueOf());
                          });
                        if (arrayDatos[0].FechaFoto === undefined) {

                            // COMPROBAMOS QUE LA FECHA DE INOCULACIÓN NO ES MAYOR A 72 HORAS
                            const fechaAUX = moment(arrayDatos[0].FechaInoculacion);
                            const fecha48h = moment(arrayDatos[0].FechaInoculacion).add(2, 'days');
                            const fecha72h = moment(arrayDatos[0].FechaInoculacion).add(3, 'days');
                            const fechaActual = moment();
                            console.log('FECHA AUX: ', fechaAUX.format('MMMM Do YYYY, h:mm:ss a'));
                            console.log('FECHA 48H: ', fecha48h.format('MMMM Do YYYY, h:mm:ss a'));
                            console.log('FECHA 72H: ', fecha72h.format('MMMM Do YYYY, h:mm:ss a'));
                            console.log('FECHA HOY: ', fechaActual);

                            if (fechaAUX < moment('2000-01-01T00:00:00')) {

                              console.log('NO HACEMOS NADA YA NO SE HA INOCULADO AUN: 1900-01-01T00:00:00: ', fechaAUX);

                            } else {
                              console.log('aux[0] ', arrayDatos[0]);
                              console.log('aux[0]: ', this.tieneResultado(arrayDatos[0]));
                              if (fechaActual < fecha72h && !this.tieneResultado(arrayDatos[0])) {
                                // COMPROBAMOS QUE LA FECHA DE INOCULACIÓN NO ES MENOR A 48 HORAS

                                  console.log('ENTRAMOS PORQUE LA FECHA ES MENOR A 72h');

                                  if (fechaActual > fecha48h) {
                                    if (this.usuario.FechaMantoux !== null  && this.usuario.FechaMantoux !== undefined && this.usuario.FechaMantoux !== arrayDatos[0].FechaInoculacion) {
                                      console.log('CREAMOS NOTIFICACIONES PORQUE NO SE HABIAN CREADO: ', this.usuario.FechaMantoux);
                                      this.crearNotificacionesLocalesMantoux(arrayDatos[0].FechaInoculacion);
                                      this.usuarioService.presentAlertTestMantouxBotones('ALERTA', 'Le recordamos, que se encuentra dentro del plazo para realizar su prueba Mantoux, y solo dispone hasta el dia ' +
                                      fecha72h + ' para realizarsela.', '', arrayDatos[0].FechaInoculacion);
                                    } else {
                                      this.usuario.HacerMantoux = true;
                                      this.usuario.FechaMantoux = moment(fechaAUX).locale('es').format().toString();
                                      console.log('FECHA USUARIO: ', this.usuario.FechaMantoux);
                                      console.log('Fecha fecha: ' , moment().locale('es').format().toString());
                                      this.usuarioService.actualizarPerfil(this.usuario);
                                      this.usuarioService.guardarUsuario(this.usuario);
                                      this.usuarioService.presentAlert('ALERTA', 'Le recordamos, que se encuentra dentro del plazo para realizar su prueba Mantoux, y solo dispone hasta el dia ' +
                                      fecha72h + ' para realizarsela.', '');

                                    }
                                  } else {
                                    if (this.usuario.FechaMantoux !== null  && this.usuario.FechaMantoux !== undefined && this.usuario.FechaMantoux !== arrayDatos[0].FechaInoculacion) {

                                      this.crearNotificacionesLocalesMantoux(arrayDatos[0].FechaInoculacion);
                                      this.usuarioService.presentAlertTestMantoux('RECUERDE', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + arrayDatos[0].FechaInoculacion +
                                      ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + moment(arrayDatos[0].FechaInoculacion).format('DD/MM/YYYY') + ' y el ' +
                                      moment(arrayDatos[0].FechaInoculacion).add(1440, 'minutes').format('DD/MM/YYYY') + ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n'
                                      + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.', arrayDatos[0].FechaInoculacion);

                                    } else {
                                      this.usuario.HacerMantoux = true;
                                      this.usuario.FechaMantoux = moment(fechaAUX).locale('es').format().toString();
                                      console.log('FECHA USUARIO: ', this.usuario.FechaMantoux);
                                      console.log('Fecha fecha: ' , moment().locale('es').format().toString());
                                      this.usuarioService.actualizarPerfil(this.usuario);
                                      this.usuarioService.guardarUsuario(this.usuario);
                                      this.usuarioService.presentAlert('RECUERDE', ' Información sobre su prueba de Mantoux', 'A Vd. se le ha realizado con fecha ' + arrayDatos[0].FechaInoculacion +
                                      ' una prueba de Mantoux, por lo que le comunicamos que entre el día ' + moment(arrayDatos[0].FechaInoculacion).format('DD/MM/YYYY') + ' y el ' +
                                      moment(arrayDatos[0].FechaInoculacion).add(1440, 'minutes').format('DD/MM/YYYY') + ' debe proceder a realizarse una fotografía a través de ésta App para su diagnóstico. \n'
                                      + 'Esta App se lo recordara a través de notificaciones push durante el plazo indicado.');

                                    }
                                  }

                                } else {
                                  if (!this.tieneResultado(arrayDatos[0])) {
                                    this.usuario.HacerMantoux = true;
                                    this.usuario.FechaMantoux = moment(fechaAUX).locale('es').format().toString();
                                    console.log('FECHA USUARIO: ', this.usuario.FechaMantoux);
                                    console.log('Fecha fecha: ' , moment().locale('es').format().toString());
                                    this.usuarioService.actualizarPerfil(this.usuario);
                                    this.usuarioService.guardarUsuario(this.usuario);
                                    this.usuarioService.presentAlertNoTestMontoux('Alerta', 'Vd. No puede realizar la prueba ya que se encuentra fuera de plazo',
                                    'Su plazo ha expirado ya que han pasado mas de 72h desde su inoculación y' +
                                    'no ha procedido a la realización de la fotografía para su diagnóstico, dicha prueba se considera invalida sin ninguna responsabilidad para Grupo MPE');

                                  }
                                }
                            }


                          } else {

                            console.log('NO HACEMOS NADA YA QUE YA TIENE FECHA DE INOCULACIÓN Y FECHA DE FOTO');

                          }
                      }

                    }
                    // tslint:disable-next-line: no-shadowed-variable
                    this.datosMantoux = a;

                } else if (xmlhttp.status === 500 ) {
                  this.presentAlert('Error al actualizar datos de mantoux', '');
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

  crearNotificacionesLocalesMantoux(fecha: string) {
    const fechaPrueba = moment(fecha);
    console.log('fecha notificacion: ', fechaPrueba.format());
    const fecha48h = moment(fechaPrueba.add(48, 'hours'));
    const fecha2d17h = moment(fecha48h.format('L') + ' 17:00');
    const fechaActual = moment().locale('es');
    console.log('fecha actual: ', fechaActual.format());
    console.log('fecha 48h ', fecha48h.format());
    console.log('fecha 48h a las 17: ', fecha2d17h.format());
    if (fechaActual >= fecha48h && fechaActual <= fecha2d17h ) {
      for (let i = 0; i < 4; i++) {
        switch (i) {
          case 0:
            // tslint:disable-next-line: no-shadowed-variable
            const notificacionHora8 = fecha48h.format('L') + ' 08:00';
            console.log('notificacionHora8:' , moment(notificacionHora8).format());
            const fechaNot0 = new Date(notificacionHora8);
            console.log('FICHAPRUEBA:', fechaNot0);

            if (fechaActual < moment(notificacionHora8)) {
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

            if (fechaActual < moment(notificacionHora11)) {

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
            const fechaNot2 = new Date(notificacionHora11);
            console.log('FICHAPRUEBA:', fechaNot2);

            if (fechaActual < moment(notificacionHora14)) {

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

            if (fechaActual < moment(notificacionHora17)) {
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

  }

  isObject( obj: any) {
    console.log('TYPE OF: ', typeof obj === 'object' ? true : false);
    return typeof obj === 'object' ? true : false;
  }

  tieneResultado(obj: any) {

    const aux: RespuestaTestMantouxInfo = obj;

    if (aux.EsPositivo.toString() === 'false' && aux.EsNegativo.toString() === 'false') {

      return false;

    } else {

      return true;

    }

  }





}
