import { Component, OnInit } from '@angular/core';
import { Certificado, RespuestaAPIGetDocumentos,RespuestaHistorial, ObtenerHistoriaDocumentos, RespuestaDocumentoPDFTrabajador, ObtenerDocumentoPDFTrabajador, RecuentoNotificacionesResponse, CertificadoPDF, RespuestaObtenerCertPDF, RespuestaAsistenciaInfo, RespuestaAsistencia } from 'src/app/interfaces/interfaces-grupo-mpe';
import { PopoverController, ModalController } from '@ionic/angular';
import { PropertyService } from 'src/app/providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { DocumentosTrabajadoresService } from 'src/app/services/documentos-trabajadores.service';
import * as moment from 'moment';
import { trigger,style,animate,transition,query,stagger } from '@angular/animations';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { HitorialNotificacionesService } from 'src/app/services/hitorial-notificaciones.service';
import { FiltroHistorialPage } from '../../modal/filtro-historial/filtro-historial.page';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { FiltroAsistenciaPage } from '../../modal/filtro-asistencia/filtro-asistencia.page';
import { EmpresaConsultor, UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { SeleccionarClientePage } from '../../modal/seleccionar-cliente/seleccionar-cliente.page';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translate3d(100px,0,0)' }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: 'translate3d(0,0,0)' }))]), { optional: true })
      ])
    ])
  ]
})
export class AsistenciaPage implements OnInit {
  searchKey = "";
  listaAsistencias = [];
  usuario: UsuarioLogin;
  empresaCoonsultor: EmpresaConsultor;
  hayConsultor = false;
  
  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private documentosService: DocumentosTrabajadoresService,
    private asistenciaService: AsistenciaService
    ) 
    {
      this.usuario = this.usuarioService.getUsuario(); 
      this.empresaCoonsultor = this.usuarioService.getEmpresaConsultor();
      if(this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null){
        if(this.usuario.Tipo === "CLIENTE"){
          this.hayConsultor = true;
        }
      }
    }

  ngOnInit() {
    this.getAsistencias();
  }

  getAsistencias(){
    try{
      this.usuarioService.present("Cargando...");
      let nifConsultor = "";
      if(this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null){
        nifConsultor = this.empresaCoonsultor.Nif;
      }
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
          '<ObtenerAsistenciasRelacion xmlns="http://tempuri.org/">' +
            '<FiltroAsist>' +
              '<FechaDesde>' + fecha_desde + '</FechaDesde>'+
              '<FechaHasta>' + fecha_hasta + '</FechaHasta>'+
              '<NombreTrabajador></NombreTrabajador>' +
              '<Dni></Dni>' +
              '<NoPresentado>0</NoPresentado>'+
              '<NifClienteConsultor>' + nifConsultor + '</NifClienteConsultor>'+
            '</FiltroAsist>' +
          '</ObtenerAsistenciasRelacion>' +
        '</soap:Body>' +
      '</soap:Envelope>';

      xmlhttp.onreadystatechange =  () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    const obj: RespuestaAsistencia = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    // tslint:disable-next-line: max-line-length
                    const a: RespuestaAsistenciaInfo = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerAsistenciasRelacionResponse']['ObtenerAsistenciasRelacionResult']));
                    console.log(a);
                    if (a.AsistenciaInfo !== undefined && !Array.isArray(a.AsistenciaInfo)) {

                      this.listaAsistencias.push(a.AsistenciaInfo);
  
                    } else {
  
                      this.listaAsistencias = a.AsistenciaInfo;
  
                    }
                    this.asistenciaService.setAsistencia(this.listaAsistencias);
                    console.log('ListaAsistencia ' + this.listaAsistencias);
                    this.usuarioService.dismiss();
                }else{
                  this.usuarioService.dismiss();
                  this.usuarioService.presentAlert("Error","Cliente "+ this.usuarioService.empresaConsultor.NombreCliente + " no encontrado","Póngase en contacto con atención al cliente atencionalcliente@grupompe.es");
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
    this.asistenciaService.findByName(event.target.value)
        .then(data => {
            this.listaAsistencias = data;
        })
        .catch(error => alert(JSON.stringify(error)));
  }

  onCancel(event) {
    this.findAll();
  }
  

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: FiltroAsistenciaPage
    });
    modal.onDidDismiss().then(() => {

      if (this.usuarioService.haFiltradoAsistencia) {
        this.listaAsistencias = this.usuarioService.getAsistencia();
      }
    });
    return await modal.present();
  }

  findAll() {
    this.listaAsistencias =this.asistenciaService.getAsistencias();
  }
  masInfo(NifTrabajador){

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
      this.getAsistencias();
      this.listaAsistencias = this.asistenciaService.getAsistencias();
    });
    return await modal.present();
  }


}
