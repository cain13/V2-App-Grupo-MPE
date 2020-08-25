import { Component } from '@angular/core';


import { PropertyService } from '../../../providers';


import { FiltroDocumentosPage } from '../../modal/filtro-documentos/filtro-documentos.page';
import { RespuestaAPIGetDocumentos, ObtenerDocumentosTrabajadores, RespuestaDocumentoPDFTrabajador, ObtenerDocumentoPDFTrabajador, Documento } from '../../../interfaces/interfaces-grupo-mpe';
import { UsuarioService } from '../../../services/usuario.service';
import { Notificacion } from 'src/app/interfaces/usuario-interfaces';

import { NgxXml2jsonService } from 'ngx-xml2json';

// Para generar pdfs
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentosTrabajadoresService } from '../../../services/documentos-trabajadores.service';
import { DatabaseService } from '../../../services/database.service';
import { NotificacionesService } from '../../../services/notificaciones.service';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { PopoverController,
         ModalController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { NotificacionesPage } from '../notificaciones/notificaciones.page';

@Component({
  selector: 'app-documentos-trabajador',
  templateUrl: './documentos-trabajador.page.html',
  styleUrls: ['./documentos-trabajador.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class DocumentosTrabajadorPage {

  listaDocumentos = [];
  cantidad$: Observable<number>;
  Cantidad: number;
  searchKey = '';
  listaMensajes: Array<Notificacion> = [];
  pagina = 0;

  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private documentosService: DocumentosTrabajadoresService,
    private db: DatabaseService,
    private notificacionesService: NotificacionesService
    ) {  }


    ionViewWillEnter() {
      this.notificacionesService.aumentarNotificaciones();
      this.cantidad$ = this.notificacionesService.getNotifiaciones$();
      this.cantidad$.subscribe(num => this.Cantidad = num);
      console.log('cnatidad$: ', this.Cantidad);


      this.getDocumentos();


    }


  getDocumentos(event?) {
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
              '<TestCovid>false</TestCovid>' +
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

                      if (Array.isArray(a.DocumentoInfo)) {

                        this.listaDocumentos.push(a.DocumentoInfo);

                      } else {
                        const docs: Documento[] = a.DocumentoInfo;
                        for (const doc of docs) {

                          this.listaDocumentos.push(doc);

                        }
                        aux = a.DocumentoInfo;

                      }
                      this.documentosService.setDocumento(this.listaDocumentos);
                      console.log('ListaDocumentos ' + this.listaDocumentos);

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


  async notifications() {
    const modal = await this.modalCtrl.create({
      component: NotificacionesPage
    });

    return await modal.present();
  }

  async getNotificaciones() {
    this.usuarioService.present('Cargando notificaciones...');

    await this.db.obtenerTodasNotificacion().then( async res => {

      console.log('FICHAR: respuestaBD motivos: ', res);
      this.listaMensajes = res;
      if (res.length === 0) {
        this.getSinNotificaciones();
      }
      this.usuarioService.dismiss();
    }).catch(() => {
      this.usuarioService.dismiss();
      console.log('FICHAR ERROR: Obtener Lista Motivos');
      this.getSinNotificaciones();
    });

  }
  getSinNotificaciones() {

      const notificacion = {
        IdNotificacion: 1,
        Titulo: 'No tienes notificaciones',
        Icono: 'notifications-off-outline',
        Ruta: '/',
        Mensaje: 'No hay notificaciones nuevas',
        Fecha:  moment().format('YYYY-MM-DDT00:00:00'),
        Leido: 1,
        TipoDocumento: 'Docuemento'
      };
      this.listaMensajes.push(notificacion);
      return this.listaMensajes;
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
