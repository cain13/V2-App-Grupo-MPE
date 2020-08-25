import { Component } from '@angular/core';


import { PropertyService } from '../../../providers';


import { NotificationsComponent } from '../../../components/notifications/notifications.component';
import { FiltroDocumentosPage } from '../../modal/filtro-documentos/filtro-documentos.page';
// tslint:disable-next-line: max-line-length
import { RespuestaAPIGetDocumentos, ObtenerDocumentosTrabajadores, RespuestaDocumentoPDFTrabajador, ObtenerDocumentoPDFTrabajador, RecuentoNotificacionesResponse, Documento } from '../../../interfaces/interfaces-grupo-mpe';
import { UsuarioService } from '../../../services/usuario.service';

import { NgxXml2jsonService } from 'ngx-xml2json';

// Para generar pdfs
import { DocumentosTrabajadoresService } from '../../../services/documentos-trabajadores.service';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { PopoverController,
         ModalController } from '@ionic/angular';

@Component({
  selector: 'app-documentos-covid',
  templateUrl: './documentos-covid.page.html',
  styleUrls: ['./documentos-covid.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class DocumentosCOVIDPage {

  listaDocumentos = [];
  Cantidad = 0;
  searchKey = '';
  pagina = 0;





  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private documentosService: DocumentosTrabajadoresService
    ) {  }


    ionViewWillEnter() {
      // this.usuarioService.desactivarSegundoPlano = false;
      this.RecuentoNotificaciones();
      this.getDocumentos();


    }


  getDocumentos( event ?) {
    let aux: Documento[] = [];
    try {
      this.usuarioService.present('Cargando...');
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
          '<ObtenerTrabajadorRelacionDocumentos xmlns="http://tempuri.org/">' +
            '<TestCovid>true</TestCovid>' +
            '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
            '<NumeroRegistro>15</NumeroRegistro>' +
          '</ObtenerTrabajadorRelacionDocumentos>' +
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
                    if (a.DocumentoInfo !== undefined) {

                      if (!Array.isArray(a.DocumentoInfo)) {

                        this.listaDocumentos.push(a.DocumentoInfo);
                        aux = a.DocumentoInfo;

                      } else {
                        const docs: Documento[] = a.DocumentoInfo;
                        for (const doc of docs) {

                          this.listaDocumentos.push(doc);

                        }
                        aux = a.DocumentoInfo;

                      }
                      this.documentosService.setDocumento(this.listaDocumentos);
                      console.log('ListaDocumentos ' + this.listaDocumentos);
                      this.usuarioService.dismiss();
                    }
                } else {
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

    this.pagina = this.pagina + 1;


    if ( event ) {

      event.target.complete();

      if ( Array.isArray(aux) ) {
        if (aux.length === 0) {
          console.log('No hay mas documentos');

          event.target.disabled = true;

        }

      } else {
        console.log('No hay mas documentos');

        event.target.disabled = true;

      }

    }
  }

  downloadDocumento(id) {
    try {
      this.usuarioService.present('Desacargando...');
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
            '<Id>' + id + '</Id>' +
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
                    this.usuarioService.saveAndOpenPdf(pdf.Datos, pdf.NombreFichero);
                }
            }
        };
      xmlhttp.send(sr);
      this.usuarioService.dismiss();
    } catch (error) {
      this.usuarioService.dismiss();
    }

  }
  RecuentoNotificaciones() {

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
        '<ObtenerRecuentoDocumentosNuevos xmlns="http://tempuri.org/" />' +
      '</soap:Body>' +
    '</soap:Envelope>';
    xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                  const xml = xmlhttp.responseXML;
                  const obj: RecuentoNotificacionesResponse = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                  // tslint:disable-next-line: max-line-length
                  const a = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerRecuentoDocumentosNuevosResponse']['ObtenerRecuentoDocumentosNuevosResult']));
                  this.Cantidad = a;
                  this.documentosService.setCantidadDocumentosSinLeer(this.Cantidad);
                  console.log('a ' + a);
              } else {
              }
          } else {
          }
      };
    xmlhttp.send(sr);
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
    console.log(event.target.value);
    this.documentosService.findByName(event.target.value)
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
      component: FiltroDocumentosPage
    });
    return await modal.present();
  }

  findAll() {
    this.listaDocumentos = this.documentosService.getDocumentos();
  }
}

