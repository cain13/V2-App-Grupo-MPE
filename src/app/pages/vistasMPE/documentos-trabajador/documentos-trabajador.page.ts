import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import {
  InvoicesService,
  TranslateProvider
} from '../../../providers';

import { PropertyService } from '../../../providers';

import { SearchFilterPage } from '../../../pages/modal/search-filter/search-filter.page';

import { NotificationsComponent } from '../../../components/notifications/notifications.component';
import { FiltroDocumentosPage } from '../../modal/filtro-documentos/filtro-documentos.page';
import { DocumentosService } from '../../../providers/documentos/documentos.service';
import { CertificadosAptitudService } from '../../../providers/certificadosAptitud/certificados-aptitud.service';
import { RespuestaAPIGetDocumentos, ObtenerDocumentosTrabajadores, RespuestaDocumentoPDFTrabajador, ObtenerDocumentoPDFTrabajador } from '../../../interfaces/interfaces-grupo-mpe';
import { UsuarioService } from '../../../services/usuario.service';
import { NgxXml2jsonService } from 'ngx-xml2json';

// Para generar pdfs
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

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

@Component({
  selector: 'app-documentos-trabajador',
  templateUrl: './documentos-trabajador.page.html',
  styleUrls: ['./documentos-trabajador.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('300ms', [animate('500ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class DocumentosTrabajadorPage {

  searchKey = '';
  listaDocumentos = [];

  properties: Array<any>;



  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private platform: Platform,
    private opener: FileOpener,
    private file: File
    ) {  }


    ionViewWillEnter() {
      // this.usuarioService.desactivarSegundoPlano = false;
      this.getDocumentos();
    }


  getDocumentos() {

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.responseType = 'document';
      // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
    const sr =

    '<?xml version="1.0" encoding="utf-8"?>' +
    // tslint:disable-next-line: max-line-length
    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Header>' +
        '<AuthHeader xmlns="http://tempuri.org/">' +
        '<Usuario>' + this.usuarioService.usuario.Usuario + '</Usuario>' +
        '<Password>' + this.usuarioService.usuario.Password + '</Password>' +
        '</AuthHeader>' +
      '</soap:Header>' +
      '<soap:Body>' +
        '<ObtenerTrabajadorRelacionDocumentos  xmlns="http://tempuri.org/" />' +
      '</soap:Body>' +
    '</soap:Envelope>';

    xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                  const xml = xmlhttp.responseXML;
                  const obj: RespuestaAPIGetDocumentos = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                  // tslint:disable-next-line: max-line-length
                  const a: ObtenerDocumentosTrabajadores = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerTrabajadorRelacionDocumentosResponse']['ObtenerTrabajadorRelacionDocumentosResult']));
                  console.log(a);
                  this.listaDocumentos = a.DocumentoInfo;
                  console.log('ListaDocumentos ' + this.listaDocumentos);
              }
          }
      };
    xmlhttp.send(sr);
  }

  downloadDocumento(id){
    console.log(id);
    let pdf:  ObtenerDocumentoPDFTrabajador;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.responseType = 'document';
      // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
    const sr =

    '<?xml version="1.0" encoding="utf-8"?>' +
    // tslint:disable-next-line: max-line-length
    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Header>' +
        '<AuthHeader xmlns="http://tempuri.org/">' +
        '<Usuario>' + this.usuarioService.usuario.Usuario + '</Usuario>' +
        '<Password>' + this.usuarioService.usuario.Password + '</Password>' +
        '</AuthHeader>' +
      '</soap:Header>' +
      '<soap:Body>' +
        '<ObtenerTrabajadorPdf xmlns="http://tempuri.org/">' +
          '<Id>'+ id + '</Id>'+
        '</ObtenerTrabajadorPdf>' +
      '</soap:Body>' +
    '</soap:Envelope>';

    xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                  const xml = xmlhttp.responseXML;
                  const obj: RespuestaDocumentoPDFTrabajador = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                  const a: ObtenerDocumentoPDFTrabajador = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerTrabajadorPdfResponse']['ObtenerTrabajadorPdfResult']));
                  console.log(a);
                  pdf = a;
                  console.log('NombreFichero ' + a.NombreFichero);
                  this.saveAndOpenPdf(pdf.Datos,pdf.NombreFichero);
              }
          }
      };
    xmlhttp.send(sr);


  }
saveAndOpenPdf(pdf: string, filename: string) {
  console.log('path ' + this.file.dataDirectory);
  const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.dataDirectory;
  this.file.writeFile(writeDirectory, filename, this.convertBase64ToBlob(pdf, 'data:application/pdf;base64',512), {replace: true})
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

  async notifications() {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  onInput(event) {
    this.service.findByName(this.searchKey)
        .then(data => {
            this.properties = data;
        })
        .catch(error => alert(JSON.stringify(error)));
  }

  onCancel(event) {
    this.findAll();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: FiltroDocumentosPage
    });
    return await modal.present();
  }

  findAll() {
    this.service.findAll()
      .then(data => this.properties = data)
      .catch(error => alert(error));

  }


}
