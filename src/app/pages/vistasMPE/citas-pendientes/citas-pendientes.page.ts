import { Component, OnInit } from '@angular/core';
import { RespuestaCitasPendientes, RespuestaCitasiaInfo } from 'src/app/interfaces/interfaces-grupo-mpe';
import { PopoverController, ModalController } from '@ionic/angular';
import { PropertyService } from 'src/app/providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { DocumentosTrabajadoresService } from 'src/app/services/documentos-trabajadores.service';
import * as moment from 'moment';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { FiltroCitasPage } from '../../modal/filtro-citas/filtro-citas.page';
import { CitasPendientesService } from '../../../services/citas-pendientes.service';


@Component({
  selector: 'app-citas-pendientes',
  templateUrl: './citas-pendientes.page.html',
  styleUrls: ['./citas-pendientes.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translate3d(100px,0,0)' }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: 'translate3d(0,0,0)' }))]), { optional: true })
      ])
    ])
  ]
})
export class CitasPendientesPage implements OnInit {

  searchKey = '';
  listaCitas = [];

  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private citasService: CitasPendientesService
    ) {  }

  ngOnInit() {
    this.getCitasPendientes();
  }

  getCitasPendientes() {
    try {

      let nifConsultor = '';
      if (this.usuarioService.usuario.Tipo === 'CONSULTOR') {
        nifConsultor = this.usuarioService.empresaConsultor.Nif;
      }
      this.usuarioService.present('Cargando Citas...');
      const fecha_desde = moment().format('YYYY-MM-DDT00:00:00');
      const fecha_hasta = moment().add(1, 'year').format('YYYY-MM-DDT00:00:00');
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
          '<ObtenerHistoricoNotificacionesRelacionDocumentos xmlns="http://tempuri.org/">' +
            '<FiltroNot>' +
              '<FechaDesde>' + fecha_desde + '</FechaDesde>' +
              '<FechaHasta>' + fecha_hasta + '</FechaHasta>' +
              '<NifClienteConsultor>' + nifConsultor + '</NifClienteConsultor>' +
            '</FiltroNot>' +
          '</ObtenerHistoricoNotificacionesRelacionDocumentos>' +
        '</soap:Body>' +
      '</soap:Envelope>';

      xmlhttp.onreadystatechange =  () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    const obj: RespuestaCitasPendientes = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    // tslint:disable-next-line: max-line-length
                    console.log('Respuesta: ', obj);

                    const a: RespuestaCitasiaInfo = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCitasPendientesRelacionResponse']['ObtenerCitasPendientesRelacionResult']));
                    console.log(a);

                    if (a.CitasInfo !== undefined && !Array.isArray(a.CitasInfo)) {

                      this.listaCitas.push(a.CitasInfo);

                    } else {

                      this.listaCitas = a.CitasInfo;

                    }
                    this.citasService.setCitaPendiente(this.listaCitas);
                    console.log('ListaHistorial ' + this.listaCitas);
                    this.usuarioService.dismiss();
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

  }


  downloadDocumento() {
   /*  this.usuarioService.present('Descargando...');
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
                  this.usuarioService.saveAndOpenPdf(pdf.Datos, pdf.NombreFichero);
              }
          }
      };
    xmlhttp.send(sr); */

  }

  onInput(event) {
    console.log(event.target.value);
    this.citasService.findByName(event.target.value)
        .then(data => {
            this.listaCitas = data;
        })
        .catch(error => alert(JSON.stringify(error)));
  }

  onCancel(event) {
    this.findAll();
  }


  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: FiltroCitasPage
    });
    modal.onDidDismiss().then(() => {

      if (this.usuarioService.haFiltradoHistorial) {
        this.listaCitas = this.usuarioService.getCertificados();
      }
    });
    return await modal.present();
  }

  findAll() {
    this.listaCitas = this.citasService.getCertificados();
  }

}
