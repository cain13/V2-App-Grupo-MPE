import { Component, OnInit } from '@angular/core';
import { CertificadoPDF, RespuestaObtenerCertPDF } from 'src/app/interfaces/interfaces-grupo-mpe';
import { PopoverController, ModalController } from '@ionic/angular';
import { PropertyService } from 'src/app/providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { DocumentosTrabajadoresService } from 'src/app/services/documentos-trabajadores.service';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { HitorialNotificacionesService } from 'src/app/services/hitorial-notificaciones.service';


@Component({
  selector: 'app-planficacion-vs',
  templateUrl: './planficacion-vs.page.html',
  styleUrls: ['./planficacion-vs.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translate3d(100px,0,0)' }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: 'translate3d(0,0,0)' }))]), { optional: true })
      ])
    ])
  ]
})
export class PlanficacionVSPage implements OnInit {

  searchKey = '';
  listaDocumentos = [];

  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private historialService: HitorialNotificacionesService
    ) {  }

  ngOnInit() {
    this.getHistorialDocumentos();
  }

  getHistorialDocumentos() {
   /*  try{
      this.usuarioService.present("Cargando...");
      let fecha_desde = '1900-01-01T00:00:00';
      let fecha_hasta = moment().format('YYYY-MM-DDT00:00:00');
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
              '<FechaDesde>' + fecha_desde + '</FechaDesde>'+
              '<FechaHasta>' + fecha_hasta + '</FechaHasta>'+
              '<NifClienteConsultor></NifClienteConsultor>'+
            '</FiltroNot>' +
          '</ObtenerHistoricoNotificacionesRelacionDocumentos>' +
        '</soap:Body>' +
      '</soap:Envelope>';

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

                    } else {

                      this.listaDocumentos = a.HistoricoNotificacionInfo;

                    }
                    this.historialService.setDocumento(this.listaDocumentos);
                    console.log('ListaHistorial ' + this.listaDocumentos);
                }
            }
        };
      xmlhttp.send(sr);

      this.usuarioService.dismiss();
    }catch(error){
      this.usuarioService.dismiss();
    }
 */
  }


  downloadDocumento(id) {
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
                  this.usuarioService.saveAndOpenPdf(pdf.Datos, pdf.NombreFichero);
              }
          }
      };
    xmlhttp.send(sr);

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
   /*  const modal = await this.modalCtrl.create({
      component: FiltroHistorialPage
    });
    modal.onDidDismiss().then(() => {

      if (this.usuarioService.haFiltradoHistorial) {
        this.listaDocumentos = this.usuarioService.getHistorial();
      }
    });
    return await modal.present(); */
  }

  findAll() {
    this.listaDocumentos = this.historialService.getDocumentos();
  }

}
