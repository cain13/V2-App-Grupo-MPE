import { Component, OnInit, ViewChild } from '@angular/core';
import { CertificadoPDF, RespuestaObtenerCertPDF, RespuestaHistorial, ObtenerHistoriaDocumentos } from 'src/app/interfaces/interfaces-grupo-mpe';
import { PopoverController, ModalController, IonInfiniteScroll, ViewDidLeave, Platform } from '@ionic/angular';
import { PropertyService } from 'src/app/providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { DocumentosTrabajadoresService } from 'src/app/services/documentos-trabajadores.service';
import * as moment from 'moment';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { HitorialNotificacionesService } from 'src/app/services/hitorial-notificaciones.service';
import { FiltroHistorialPage } from '../../modal/filtro-historial/filtro-historial.page';
import { EmpresaConsultor, UsuarioLogin, Notificacion } from 'src/app/interfaces/usuario-interfaces';
import { SeleccionarClientePage } from '../../modal/seleccionar-cliente/seleccionar-cliente.page';
import { DatosFiltros } from '../../../interfaces/usuario-interfaces';

@Component({
  selector: 'app-historial-notificaciones',
  templateUrl: './historial-notificaciones.page.html',
  styleUrls: ['./historial-notificaciones.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translate3d(100px,0,0)' }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: 'translate3d(0,0,0)' }))]), { optional: true })
      ])
    ])
  ]
})

export class HistorialNotificacionesPage implements OnInit, ViewDidLeave {

  searchKey = '';
  listaDocumentos = [];
  usuario: UsuarioLogin;
  empresaCoonsultor: EmpresaConsultor;
  hayConsultor = false;
  pagina = 0;
  filtros: DatosFiltros;
  listaCertAptitud = [];
  listaMemoriaAnual = [];
  listaPlanificacion = [];
  listaEstudioEpi = [];
  listaOtros = [];
  isSmallPhone: boolean;



  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private historialService: HitorialNotificacionesService,
    private platform: Platform
    ) {
      this.usuario = this.usuarioService.getUsuario();
      this.empresaCoonsultor = this.usuarioService.getEmpresaConsultor();
      this.pagina = 0;
      if (this.usuario.Tipo === 'CONSULTOR') {
        if (this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
          this.hayConsultor = true;
        }
      }
    }

  ngOnInit() {
    this.pagina = 0;
    this.platform.ready().then(() => {
      console.log('Width: ' + this.platform.width());
      console.log('Height: ' + this.platform.height());
      if (this.platform.height() < 731) {
        this.isSmallPhone = true;
      } else {
        this.isSmallPhone = false;
      }
    });
    this.getHistorialDocumentos();

  }
  ionViewDidLeave() {
    this.pagina = 0;
    console.log('this.infiniteScroll.disabled 1 ', this.infiniteScroll.disabled);
    if (this.infiniteScroll.disabled === true ) {
      this.infiniteScroll.disabled = false;
      console.log('this.infiniteScroll.disabled ', this.infiniteScroll.disabled);
    }
  }

  getHistorialDocumentos(event?) {
    if (this.filtros !== undefined && this.filtros !== null) {
      try {
        if (event === undefined || event === null && this.pagina === 0) {
          this.pagina = 0;
          this.listaDocumentos = [];
          console.log('Numero pagina ', this.pagina);
          this.usuarioService.present('Cargando...');
        }
        let aux: any[] = [];
        let nifConsultor = '';
        if (this.usuario.Tipo === 'CONSULTOR') {
          if (this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
            nifConsultor = this.empresaCoonsultor.Nif;
          }
        }
        let fecha_desde = moment().format('YYYY-MM-DDT00:00:00');
        let fecha_hasta = moment().add(1, 'month').format('YYYY-MM-DDT00:00:00');
        if(this.filtros.fecha_desde !== undefined && this.filtros.fecha_desde !== null){
          fecha_desde = this.filtros.fecha_desde;
        }
        if(this.filtros.fecha_hasta !== undefined && this.filtros.fecha_hasta !== null){
          fecha_hasta = this.filtros.fecha_hasta;
        }
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
/*         xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
 */        xmlhttp.responseType = 'document';
          // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
        const sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap:Header>' +
            '<AuthHeader xmlns="http://tempuri.org/">' +
            '<Usuario>' + this.usuarioService.usuario.Usuario + '</Usuario>' +
            '<Password>' + this.usuarioService.usuario.Password + '</Password>' +
            '</AuthHeader>' +
          '</soap:Header>' +
          '<soap:Body>' +
            '<ObtenerHistoricoNotificacionesRelacionDocumentos xmlns="http://tempuri.org/">' +
              '<FiltroNot>' +
                '<FechaDesde>' + fecha_desde + '</FechaDesde>' +
                '<FechaHasta>' + fecha_hasta + '</FechaHasta>' +
                '<NifClienteConsultor>'  + nifConsultor + '</NifClienteConsultor>' +
              '</FiltroNot>' +
              '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
              '<NumeroRegistro>20</NumeroRegistro>' +
            '</ObtenerHistoricoNotificacionesRelacionDocumentos>' +
          '</soap:Body>' +
        '</soap:Envelope>';
        console.log('sr ' + sr);
        xmlhttp.onreadystatechange =  () => {
              if (xmlhttp.readyState === 4) {
                  if (xmlhttp.status === 200) {
                      const xml = xmlhttp.responseXML;
                      const obj: RespuestaHistorial = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                      // tslint:disable-next-line: max-line-length
                      const a: ObtenerHistoriaDocumentos = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerHistoricoNotificacionesRelacionDocumentosResponse']['ObtenerHistoricoNotificacionesRelacionDocumentosResult']));
                      console.log(a);
                      if (a.HistoricoNotificacionInfo !== undefined && !Array.isArray(a.HistoricoNotificacionInfo)) {

                        this.listaDocumentos.push(a.HistoricoNotificacionInfo);
                        aux = a.HistoricoNotificacionInfo;

                      } else {

                        this.listaDocumentos = a.HistoricoNotificacionInfo;
                        aux = a.HistoricoNotificacionInfo;

                      }
                      this.historialService.setDocumento(this.listaDocumentos);
                      console.log('ListaHistorial ' + this.listaDocumentos);

                  } else {

                    if (this.usuario.Tipo === 'CONSULTOR') {
                      // tslint:disable-next-line: max-line-length
                      this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
                    }
                  }

                  if ( event !== undefined ) {
                    event.target.complete();
                    if ( Array.isArray(aux) ) {
                      if (aux.length < 20) {
                        console.log('No hay mas documentos');
                        event.target.disabled = true;
                      }
                    } else {
                      console.log('No hay mas documentos');
                      event.target.disabled = true;
                    }
                  }
                  this.usuarioService.dismiss();

              } else {
                this.usuarioService.dismiss();
              }
          };

        xmlhttp.send(sr);

      } catch (error) {
        this.usuarioService.dismiss();

      }

    } else {

      try {
        if (event === undefined || event === null && this.pagina === 0) {
          this.pagina = 0;
          console.log('Numero pagina ', this.pagina);
          this.usuarioService.present('Cargando...');
        }
        let aux: any[] = [];
        let nifConsultor = '';
        if (this.usuario.Tipo === 'CONSULTOR') {
          if (this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
            nifConsultor = this.empresaCoonsultor.Nif;
          }
        }
        const fecha_desde = '1900-01-01T00:00:00';
        const fecha_hasta = moment().add(1, 'days').format('YYYY-MM-DDT00:00:00');
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
/*         xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
 */        xmlhttp.responseType = 'document';
          // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
        const sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap:Header>' +
            '<AuthHeader xmlns="http://tempuri.org/">' +
            '<Usuario>' + this.usuarioService.usuario.Usuario + '</Usuario>' +
            '<Password>' + this.usuarioService.usuario.Password + '</Password>' +
            '</AuthHeader>' +
          '</soap:Header>' +
          '<soap:Body>' +
            '<ObtenerHistoricoNotificacionesRelacionDocumentos xmlns="http://tempuri.org/">' +
              '<FiltroNot>' +
                '<FechaDesde>' + fecha_desde + '</FechaDesde>' +
                '<FechaHasta>' + fecha_hasta + '</FechaHasta>' +
                '<NifClienteConsultor>'  + nifConsultor + '</NifClienteConsultor>' +
              '</FiltroNot>' +
              '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
              '<NumeroRegistro>20</NumeroRegistro>' +
            '</ObtenerHistoricoNotificacionesRelacionDocumentos>' +
          '</soap:Body>' +
        '</soap:Envelope>';
        console.log('sr ' + sr);
        xmlhttp.onreadystatechange =  () => {
              if (xmlhttp.readyState === 4) {
                  if (xmlhttp.status === 200) {
                      const xml = xmlhttp.responseXML;
                      const obj: RespuestaHistorial = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                      // tslint:disable-next-line: max-line-length
                      const a: ObtenerHistoriaDocumentos = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerHistoricoNotificacionesRelacionDocumentosResponse']['ObtenerHistoricoNotificacionesRelacionDocumentosResult']));
                      console.log(a);
                      if (a.HistoricoNotificacionInfo !== undefined && !Array.isArray(a.HistoricoNotificacionInfo)) {

                        this.listaDocumentos.push(a.HistoricoNotificacionInfo);
                        aux = a.HistoricoNotificacionInfo;

                      } else {

                        this.listaDocumentos = a.HistoricoNotificacionInfo;
                        aux = a.HistoricoNotificacionInfo;

                      }
                      this.historialService.setDocumento(this.listaDocumentos);
                      this.clasificarDocumentos(this.listaDocumentos);
                      console.log('ListaHistorial ' + this.listaDocumentos);

                  } else {
                    if (this.usuario.Tipo === 'CONSULTOR') {
                      // tslint:disable-next-line: max-line-length
                      this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
                    }
                  }

                  if ( event !== undefined ) {
                    event.target.complete();
                    if ( Array.isArray(aux) ) {
                      if (aux.length < 20) {
                        console.log('No hay mas documentos');
                        event.target.disabled = true;
                      }
                    } else {
                      console.log('No hay mas documentos');
                      event.target.disabled = true;
                    }
                  }
                  this.usuarioService.dismiss();
              } else {
                this.usuarioService.dismiss();
              }
          };

        xmlhttp.send(sr);

      } catch (error) {
        this.usuarioService.dismiss();

      }

    }
    this.pagina = this.pagina + 1;
  }


  downloadDocumento(id) {
    try {

      this.usuarioService.present('Descargando...');
      console.log('idDocumentos ' + id);
      let pdf: CertificadoPDF;
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
      xmlhttp.setRequestHeader('Content-Type', 'text/xml');
/*       xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
 */      xmlhttp.responseType = 'document';
        // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
      const sr =

      '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Header>' +
          '<AuthHeader xmlns="http://tempuri.org/">' +
            '<Usuario>' + this.usuarioService.usuario.Usuario + '</Usuario>' +
            '<Password>' + this.usuarioService.usuario.Password + '</Password>' +
          '</AuthHeader>' +
        '</soap:Header>' +
        '<soap:Body>' +
          '<ObtenerCertificadoAptitudPdf xmlns="http://tempuri.org/">' +
            '<IdDocumento>' + id + '</IdDocumento>' +
          '</ObtenerCertificadoAptitudPdf>' +
        '</soap:Body>' +
      '</soap:Envelope>';
    console.log('sr ', sr);
      xmlhttp.onreadystatechange =  () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    const obj: RespuestaObtenerCertPDF = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    const a: CertificadoPDF = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCertificadoAptitudPdfResponse']['ObtenerCertificadoAptitudPdfResult']));
                    console.log(a);
                    pdf = a;
                    console.log('NombreFichero ' + a.NombreFichero);
                    this.usuarioService.dismiss();
                    this.usuarioService.saveAndOpenPdf(pdf.Datos, pdf.NombreFichero);
                } else {
                  this.usuarioService.presentAlert('Error', 'Error al descargar documento', 'El documento no tiene un id valido.');
                  this.usuarioService.dismiss();
                }
            } else {
              this.usuarioService.dismiss();
            }
        };
      xmlhttp.send(sr);
    } catch (error) {
      this.usuarioService.dismiss();
    }
  }

  onInput(event) {
    console.log(event.target.value);
    this.historialService.findByName(event.target.value)
        .then(data => {
            this.listaDocumentos = data;
        })
        .catch(error => alert(JSON.stringify(error)));
  }

  onCancel(event) {
    this.findAll();
  }


  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: FiltroHistorialPage
    });
    modal.onDidDismiss().then(() => {

     /*  if (this.usuarioService.haFiltradoHistorial) {
        this.listaDocumentos = this.usuarioService.getHistorial();
      } */
      this.pagina = 0;
      this.filtros = this.historialService.getFiltros();
      this.getHistorialDocumentos();

    });
    return await modal.present();
  }

  findAll() {
    this.listaDocumentos = this.historialService.getDocumentos();
  }


  seleccionarEmpresa() {
    this.vistaSeleccionarEmpresa();
  }

  async vistaSeleccionarEmpresa() {
    const modal = await this.modalCtrl.create({
      component: SeleccionarClientePage
    });
    modal.onDidDismiss().then(() => {
      console.log('Entra a modal seleccionar cliente');
      this.empresaCoonsultor = this.usuarioService.getEmpresaConsultor();
      this.getHistorialDocumentos();
      this.listaDocumentos = this.historialService.getDocumentosFiltro();
    });
    return await modal.present();
  }


  clasificarDocumentos(listaDocu: Notificacion[]) {
    if (listaDocu.length !== 0) {
      for (const doc of listaDocu) {

        switch (doc.TipoDocumento.toString().toUpperCase()) {

          case 'CERTIFICADO APTITUD': {

            this.listaCertAptitud.push(doc);
            break;
          }

          case 'MEMORIA ANUAL': {

            this.listaMemoriaAnual.push(doc);
            break;
          }

          case 'PLANIFICACION VS': {

            this.listaPlanificacion.push(doc);
            break;
          }

          case 'ESTUDIO EPIDEMIOLOGICO': {

            this.listaEstudioEpi.push(doc);
            break;
          }

          default: {

            this.listaOtros.push(doc);
            break;
          }

        }

      }

    }


  }


}
