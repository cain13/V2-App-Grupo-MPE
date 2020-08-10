import { Component, OnInit } from '@angular/core';
import { RespuestaHistorial, ObtenerHistoriaDocumentos, CertificadoPDF, RespuestaObtenerCertPDF } from 'src/app/interfaces/interfaces-grupo-mpe';
import { PopoverController, ModalController } from '@ionic/angular';
import { PropertyService } from 'src/app/providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { DocumentosTrabajadoresService } from 'src/app/services/documentos-trabajadores.service';
import * as moment from 'moment';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { HitorialNotificacionesService } from 'src/app/services/hitorial-notificaciones.service';
import { FiltroHistorialPage } from '../../modal/filtro-historial/filtro-historial.page';
import { EmpresaConsultor, UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { SeleccionarClientePage } from '../../modal/seleccionar-cliente/seleccionar-cliente.page';

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

export class HistorialNotificacionesPage implements OnInit {

  searchKey = '';
  listaDocumentos = [];
  usuario: UsuarioLogin;
  empresaCoonsultor: EmpresaConsultor;
  hayConsultor = false;
  
  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private historialService: HitorialNotificacionesService
    ) 
    {
      this.usuario = this.usuarioService.getUsuario(); 
      this.empresaCoonsultor = this.usuarioService.getEmpresaConsultor();
      if(this.usuario.Tipo === "CONSULTOR"){
        if(this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null){
          this.hayConsultor = true;
        }
      }
    }

  ngOnInit() {
    this.getHistorialDocumentos();
    
  }

  getHistorialDocumentos(){
    try{
     
      let nifConsultor = "";
      if(this.usuario.Tipo === "CONSULTOR"){
        if(this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null){
          nifConsultor = this.empresaCoonsultor.Nif;
        }
      }
      this.usuarioService.present("Cargando...");
      let fecha_desde = '1900-01-01T00:00:00';
      let fecha_hasta = moment().add(1, 'days').format('YYYY-MM-DDT00:00:00');
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
              '<NifClienteConsultor>'  + nifConsultor + '</NifClienteConsultor>'+
            '</FiltroNot>' +
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

                    } else {

                      this.listaDocumentos = a.HistoricoNotificacionInfo;

                    }
                    this.historialService.setDocumento(this.listaDocumentos);
                    console.log('ListaHistorial ' + this.listaDocumentos);
                    this.usuarioService.dismiss();
                }else{
                  this.usuarioService.dismiss();
                  if(this.usuario.Tipo === "CONSULTOR"){
                    this.usuarioService.presentAlert("Error","Cliente "+ this.usuarioService.empresaConsultor.NombreCliente + " no encontrado","Póngase en contacto con atención al cliente atencionalcliente@grupompe.es");
                  }
                }
            }else{
              this.usuarioService.dismiss();
            }
        };
      xmlhttp.send(sr);
  
    }catch(error){
      this.usuarioService.dismiss();
    }

  }


  downloadDocumento(id) {
    try{
     
      this.usuarioService.present('Descargando...');
      console.log("idDocumentos " + id);
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
    console.log("sr ", sr);
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
                }else{
                  this.usuarioService.presentAlert("Error","Error al descargar documento","El documento no tiene un id valido.");
                  this.usuarioService.dismiss();
                }
            }else{
              this.usuarioService.dismiss();
            }
        };
      xmlhttp.send(sr);
    }catch(error){
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

      if (this.usuarioService.haFiltradoHistorial) {
        this.listaDocumentos = this.usuarioService.getHistorial();
      }
    });
    return await modal.present();
  }

  findAll() {
    this.listaDocumentos = this.historialService.getDocumentos();
  }

  
  seleccionarEmpresa(){
    this.vistaSeleccionarEmpresa();
  }

  async vistaSeleccionarEmpresa(){
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


}
