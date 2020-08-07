import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { PropertyService } from '../../../providers';

import { SearchFilterPage } from '../../../pages/modal/search-filter/search-filter.page';

import { NotificationsComponent } from '../../../components/notifications/notifications.component';
import { FiltroDocumentosPage } from '../../modal/filtro-documentos/filtro-documentos.page';
import { File } from '@ionic-native/file/ngx';

import * as moment from 'moment';


import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { NavController, MenuController, PopoverController,
         AlertController, ModalController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { RespuestaGetAPICertificadosAptitud, ObtenerCertificados, RespuestaObtenerCertPDF, CertificadoPDF} from 'src/app/interfaces/interfaces-grupo-mpe';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { UsuarioService } from '../../../services/usuario.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';
import { Certificado } from '../../../interfaces/interfaces-grupo-mpe';
import { CertificadosService } from '../../../services/certificados.service';
import { ModalMasInfoPage } from '../modal-mas-info/modal-mas-info.page';

@Component({
  selector: 'app-certificado-aptitud',
  templateUrl: './certificado-aptitud.page.html',
  styleUrls: ['./certificado-aptitud.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('300ms', [animate('500ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class CertificadoAptitudPage {
  listaCertificados = [];
  searchKey = '';
  properties: Array<any>;
  usuario: UsuarioLogin;
  fechaHoy: string;



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
    private opener: FileOpener,
    private file: File,
    private platform: Platform,
    private certificadosService: CertificadosService

  ) {

    this.usuario = this.usuarioService.getUsuario();


  }

  ionViewWillEnter() {
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


  getCertificados() {
    this.usuarioService.present('Cargando datos...');
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
              '<NifClienteConsultor></NifClienteConsultor>' +
              '<IdCentroTrabajo>' + 0 + '</IdCentroTrabajo>' +
              '<IdCentroTrabajoEspecificado>' + 0 + '</IdCentroTrabajoEspecificado>' +
            '</FiltroCerApt>' +
          '</ObtenerCertificadosAptitudRelacionDocumentos>' +
        '</soap:Body>' +
      '</soap:Envelope>';


    xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                  const xml = xmlhttp.responseXML;
                  const obj: RespuestaGetAPICertificadosAptitud = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                  // tslint:disable-next-line: max-line-length
                  const a: ObtenerCertificados = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCertificadosAptitudRelacionDocumentosResponse']['ObtenerCertificadosAptitudRelacionDocumentosResult']));
                  if (a.CertificadoAptitudInfo !== undefined && !Array.isArray(a.CertificadoAptitudInfo)) {

                    this.listaCertificados.push(a.CertificadoAptitudInfo);

                  } else {

                    this.listaCertificados = a.CertificadoAptitudInfo;

                  }
                  console.log('Cert: ', a.CertificadoAptitudInfo);
                  this.certificadosService.setCertificado(this.listaCertificados);
                  this.usuarioService.dismiss();
                  console.log('Certificados APTITUD:' , this.listaCertificados);
              }
          }
      };
    xmlhttp.send(sr);
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
                  this.usuarioService.dismiss();
                  this.saveAndOpenPdf(pdf.Datos, pdf.NombreFichero);
              }
          }
      };
    xmlhttp.send(sr);

  }


  saveAndOpenPdf(pdf: string, filename: string) {
    console.log('path ' + this.file.dataDirectory);
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.dataDirectory;
    this.file.writeFile(writeDirectory, filename, this.convertBase64ToBlob(pdf, 'data:application/pdf;base64', 512), {replace: true})
      .then(() => {
          this.opener.open(writeDirectory + filename, 'application/pdf')
              .catch(() => {
                  console.log('Error opening pdf file');
              });
      })
      .catch(() => {
          console.error('Error writing pdf file');
      });
  }


  convertBase64ToBlob(b64Data, contentType, sliceSize) {
    console.log(b64Data);
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {

            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
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
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  onCancel(event) {
    this.findAll();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: FiltroDocumentosPage
    });
    modal.onDidDismiss().then(() => {

      if (this.usuarioService.haFiltrado) {
        this.listaCertificados = this.usuarioService.getCertificados();
      }
    });
    return await modal.present();
  }



  findAll() {
    this.listaCertificados = this.certificadosService.getCertificados();

  }

  

}
