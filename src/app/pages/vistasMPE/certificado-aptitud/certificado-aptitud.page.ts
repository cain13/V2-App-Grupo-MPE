import { Component, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { PropertyService } from '../../../providers';


import { FiltroDocumentosPage } from '../../modal/filtro-documentos/filtro-documentos.page';
import { File } from '@ionic-native/file/ngx';
import * as moment from 'moment';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { NavController, MenuController, PopoverController,
         AlertController, ModalController, ToastController, LoadingController, Platform, IonInfiniteScroll, ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { RespuestaGetAPICertificadosAptitud, ObtenerCertificados, RespuestaObtenerCertPDF, CertificadoPDF} from 'src/app/interfaces/interfaces-grupo-mpe';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { UsuarioService } from '../../../services/usuario.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { UsuarioLogin, EmpresaConsultor, DatosFiltros } from '../../../interfaces/usuario-interfaces';
import { Certificado } from '../../../interfaces/interfaces-grupo-mpe';
import { CertificadosService } from '../../../services/certificados.service';
import { ModalMasInfoPage } from '../modal-mas-info/modal-mas-info.page';
import { DocumentosTrabajadoresService } from 'src/app/services/documentos-trabajadores.service';
import { SeleccionarClientePage } from '../../modal/seleccionar-cliente/seleccionar-cliente.page';
import { DatabaseService } from '../../../services/database.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { Observable } from 'rxjs';
import { NotificacionesPage } from '../notificaciones/notificaciones.page';

@Component({
  selector: 'app-certificado-aptitud',
  templateUrl: './certificado-aptitud.page.html',
  styleUrls: ['./certificado-aptitud.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})

export class CertificadoAptitudPage implements ViewDidLeave, ViewWillEnter {
  listaCertificados = [];
  searchKey = '';
  properties: Array<any>;
  fechaHoy: string;
  Cantidad = 0;
  usuario: UsuarioLogin;
  empresaCoonsultor: EmpresaConsultor;
  hayConsultor = false;
  cantidad$: Observable<number>;
  pagina = 0;
  arrayIdSelec: string[] = [];
  filtros: DatosFiltros;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(
    private router: Router,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public service: PropertyService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private usuarioService: UsuarioService,
    private certificadosService: CertificadosService,
    private notificacionesService: NotificacionesService,
    private documentosService: DocumentosTrabajadoresService
  ) {

    this.usuario = this.usuarioService.getUsuario();
    this.empresaCoonsultor = this.usuarioService.getEmpresaConsultor();
    if (this.usuario.Tipo === 'CONSULTOR') {
      if (this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
        this.hayConsultor = true;
        console.log('hayConsultor ' + this.hayConsultor);
        console.log('this.usuario.Tipo  ' + this.usuario.Tipo);
      }
    }

  }


  ionViewWillEnter() {
    console.log('this.infiniteScroll.disabled 0 ', this.infiniteScroll.disabled);

    this.pagina = 0;
    this.notificacionesService.aumentarNotificaciones();
    this.cantidad$ = this.notificacionesService.getNotifiaciones$();
    this.cantidad$.subscribe(num => this.Cantidad = num);
    console.log('cnatidad$: ', this.Cantidad);

    this.menuCtrl.enable(true);
    if ( this.usuarioService.haFiltrado) {
      this.listaCertificados = [];
      this.listaCertificados = this.usuarioService.getCertificados();
      console.log('CERTIFICADOS FILTRADOS: ', this.listaCertificados);
    } else {
      this.listaCertificados = [];
      this.getCertificados();
      console.log('CERTIFICADOS SIN FILTRAR: ', this.listaCertificados);
    }


  }

  ionViewDidLeave() {
    this.pagina = 0;
    console.log('this.infiniteScroll.disabled 1 ', this.infiniteScroll.disabled);
    if (this.infiniteScroll.disabled === true ) {
      this.infiniteScroll.disabled = false;
      console.log('this.infiniteScroll.disabled ', this.infiniteScroll.disabled);
    }
  }


  getCertificados(event?) {

    let aux: Certificado[];
    if (this.filtros !== undefined && this.filtros !== null) {

      try {
        if (event === undefined || event === null && this.pagina === 0) {
          this.pagina = 0;
          this.listaCertificados = [];
          console.log('Numero pagina ', this.pagina);
          this.usuarioService.present('Cargando certificados...');
        }
        let nifConsultor = '';
        if (this.usuario.Tipo === 'CONSULTOR') {
          if (this.empresaCoonsultor !== undefined && this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
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
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
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
              '<ObtenerCertificadosAptitudRelacionDocumentos xmlns="http://tempuri.org/">' +
                '<FiltroCerApt>' +
                  '<FechaDesde>' + fecha_desde + '</FechaDesde>' +
                  '<FechaHasta>'  + fecha_hasta +  '</FechaHasta>' +
                  '<NombreTrabajador>' + this.filtros.nombre + '</NombreTrabajador>' +
                  '<Dni>' + this.filtros.dni + '</Dni>' +
                  '<NifClienteConsultor>' + nifConsultor + '</NifClienteConsultor>' +
                  '<IdCentroTrabajo>' + this.filtros.idCentro + '</IdCentroTrabajo>' +
                  '<IdCentroTrabajoEspecificado>' + this.filtros.idCentroEspecificado + '</IdCentroTrabajoEspecificado>' +
                '</FiltroCerApt>' +
                '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
                '<NumeroRegistro>20</NumeroRegistro>' +
              '</ObtenerCertificadosAptitudRelacionDocumentos>' +
            '</soap:Body>' +
          '</soap:Envelope>';

          console.log('SR: ', sr);


        xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 500) {
                console.log('500 - nifConsultor: ', nifConsultor);
                this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
              } else if (xmlhttp.status === 200) {
                  const xml = xmlhttp.responseXML;
                  const obj: RespuestaGetAPICertificadosAptitud = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                  // tslint:disable-next-line: max-line-length
                  const a: ObtenerCertificados = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCertificadosAptitudRelacionDocumentosResponse']['ObtenerCertificadosAptitudRelacionDocumentosResult']));

                  if (a.CertificadoAptitudInfo !== undefined) {
                    if (!Array.isArray(a.CertificadoAptitudInfo)) {
                      this.listaCertificados.push(a.CertificadoAptitudInfo);
                      aux = a.CertificadoAptitudInfo;
                    } else {
                      for (const cert of a.CertificadoAptitudInfo) {
                        this.listaCertificados.push(cert);
                      }
                      aux = a.CertificadoAptitudInfo;
                    }
                    console.log('Cert: ', a.CertificadoAptitudInfo);
                    this.certificadosService.setCertificado(this.listaCertificados);
                  }
              } else {
                console.log('200 ' + xmlhttp.response);
                if (this.usuario.Tipo === 'CONSULTOR') {
                  // tslint:disable-next-line: max-line-length
                  this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
                }
              }

              if ( event !== undefined && event !== null) {
                event.target.complete();
                if ( Array.isArray(aux) ) {
                  if (aux.length < 20) {
                    console.log('No hay más documentos1');
                    event.target.disabled = true;
                  }
                } else {
                  console.log('No hay más documentos2');
                  event.target.disabled = false;
                }
              }
              this.usuarioService.dismiss();

            } else {
              this.usuarioService.dismiss();
              console.log('4 ' + xmlhttp.status);
            }
        };
        xmlhttp.send(sr);
      } catch (error) {
        this.usuarioService.dismiss();
        console.log('error ', error);
      }
    } else {

      try {
        if (event === undefined || event === null && this.pagina === 0) {
          this.pagina = 0;
          this.listaCertificados = [];
          console.log('Numero pagina ', this.pagina);
          this.usuarioService.present('Cargando certificados...');
        }
        let nifConsultor = '';
        if (this.usuario.Tipo === 'CONSULTOR') {
          if (this.empresaCoonsultor !== undefined && this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
            nifConsultor = this.empresaCoonsultor.Nif;
          }
        }
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);

        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
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
              '<ObtenerCertificadosAptitudRelacionDocumentos xmlns="http://tempuri.org/">' +
                '<FiltroCerApt>' +
                  '<FechaDesde>1900-01-01T00:00:00</FechaDesde>' +
                  '<FechaHasta>' + moment().format('YYYY-MM-DDT00:00:00') + '</FechaHasta>' +
                  '<NombreTrabajador></NombreTrabajador>' +
                  '<Dni></Dni>' +
                  '<NifClienteConsultor>' + nifConsultor + '</NifClienteConsultor>' +
                  '<IdCentroTrabajo>' + 0 + '</IdCentroTrabajo>' +
                  '<IdCentroTrabajoEspecificado>' + 0 + '</IdCentroTrabajoEspecificado>' +
                '</FiltroCerApt>' +
                '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
                '<NumeroRegistro>20</NumeroRegistro>' +
              '</ObtenerCertificadosAptitudRelacionDocumentos>' +
            '</soap:Body>' +
          '</soap:Envelope>';

          console.log('SR: ', sr);


        xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 500) {
                console.log('500 - nifConsultor: ', nifConsultor);
                this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
              } else if (xmlhttp.status === 200) {
                  const xml = xmlhttp.responseXML;
                  const obj: RespuestaGetAPICertificadosAptitud = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                  // tslint:disable-next-line: max-line-length
                  const a: ObtenerCertificados = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCertificadosAptitudRelacionDocumentosResponse']['ObtenerCertificadosAptitudRelacionDocumentosResult']));

                  if (a.CertificadoAptitudInfo !== undefined) {
                    if (!Array.isArray(a.CertificadoAptitudInfo)) {
                      this.listaCertificados.push(a.CertificadoAptitudInfo);
                      aux = a.CertificadoAptitudInfo;
                    } else {
                      for (const cert of a.CertificadoAptitudInfo) {
                        this.listaCertificados.push(cert);
                      }
                      aux = a.CertificadoAptitudInfo;
                    }
                    console.log('Cert: ', a.CertificadoAptitudInfo);
                    this.certificadosService.setCertificado(this.listaCertificados);
                  }
              } else {
                console.log('200 ' + xmlhttp.response);
                if (this.usuario.Tipo === 'CONSULTOR') {
                  // tslint:disable-next-line: max-line-length
                  this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
                }
              }

              if ( event !== undefined && event !== null) {
                event.target.complete();
                if ( Array.isArray(aux) ) {
                  if (aux.length < 20) {
                    console.log('No hay más documentos1');
                    event.target.disabled = true;
                  }
                } else {
                  console.log('No hay más documentos2');
                  event.target.disabled = false;
                }
              }
              this.usuarioService.dismiss();

            } else {
              this.usuarioService.dismiss();
              console.log('4 ' + xmlhttp.status);
            }
        };
        xmlhttp.send(sr);
      } catch (error) {
        this.usuarioService.dismiss();
        console.log('error ', error);
      }


    }
    this.pagina = this.pagina + 1;




  }



  downloadCertificado(id) {
    this.usuarioService.present('Descargando...');
    console.log(id);
    let pdf: CertificadoPDF;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.responseType = 'document';
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

    xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                  const xml = xmlhttp.responseXML;
                  const obj: RespuestaObtenerCertPDF = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                  const a: CertificadoPDF = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCertificadoAptitudPdfResponse']['ObtenerCertificadoAptitudPdfResult']));
                  console.log(a);
                  pdf = a;
                  console.log('NombreFichero ' + a.NombreFichero);
                  this.usuarioService.saveAndOpenPdf(pdf.Datos, pdf.NombreFichero);
                  this.usuarioService.dismiss();
              }
          }
      };
    xmlhttp.send(sr);

  }



  async masInfo(cert: Certificado) {

    this.certificadosService.guardarCertificadoInfo(cert);
    const popover = await this.popoverCtrl.create({
      component: ModalMasInfoPage,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();


  }

  seleccionarCert(id: string) {

    const indice = this.arrayIdSelec.indexOf(id);
    if (indice !== -1) {

      this.arrayIdSelec.splice(indice, 1);

    } else {

      this.arrayIdSelec.push(id);

    }

    console.log('Elementos sele: ', this.arrayIdSelec);

  }

  seleccionarTodos() {

    for (const doc of this.listaCertificados) {

      this.seleccionarCert(doc.Id);


    }

    console.log('Elementos sele: ', this.arrayIdSelec);

  }

  async goCheckout(invoice) {
    const navigationExtras: NavigationExtras = {
      state: {
        invoice: invoice
      }
    };

    this.router.navigate(['checkout'], navigationExtras);
  }


  onInput(event) {
    console.log(event.target.value);
    this.certificadosService.findByName(event.target.value)
        .then(data => {
            this.listaCertificados = data;
        })
        .catch(error => alert(JSON.stringify(error)));
  }


  async notifications() {
    const modal = await this.modalCtrl.create({
      component: NotificacionesPage
        });
    return await modal.present();
  }

  onCancel(event) {
    this.findAll();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: FiltroDocumentosPage
    });
    modal.onDidDismiss().then(() => {

      /* if (this.usuarioService.haFiltrado) {
        this.listaCertificados = this.usuarioService.getCertificados();
      } */
      this.pagina = 0;
      this.filtros = this.documentosService.getFiltros();
      this.getCertificados();
    });
    return await modal.present();
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
      this. getCertificados();
      this.listaCertificados = this.certificadosService.getCertificados();
    });
    return await modal.present();
  }

  findAll() {
    this.listaCertificados = this.certificadosService.getCertificados();

  }



}
