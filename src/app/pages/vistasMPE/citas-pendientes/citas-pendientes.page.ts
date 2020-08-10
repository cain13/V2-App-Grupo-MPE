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
import { UsuarioLogin, EmpresaConsultor } from 'src/app/interfaces/usuario-interfaces';
import { SeleccionarClientePage } from '../../modal/seleccionar-cliente/seleccionar-cliente.page';


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
  usuario: UsuarioLogin;
  empresaCoonsultor: EmpresaConsultor;
  hayConsultor = false;

  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private citasService: CitasPendientesService
    ) 
    {
      this.usuario = this.usuarioService.getUsuario();
      this.empresaCoonsultor = this.usuarioService.getEmpresaConsultor();
      if(this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null){
        if(this.usuario.Tipo === "CONSULTOR"){
          this.hayConsultor = true;
        }
      }
    }

  ngOnInit() {
    this.getCitasPendientes();
  }

  getCitasPendientes(){
    try{
     
      let nifConsultor = "";
      if(this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null){
        nifConsultor = this.empresaCoonsultor.Nif;
      }
      this.usuarioService.present("Cargando Citas...");
      let fecha_desde = moment().format('YYYY-MM-DDT00:00:00');
      let fecha_hasta = moment().add(1,'year').format('YYYY-MM-DDT00:00:00');
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
          '<ObtenerCitasPendientesRelacion xmlns="http://tempuri.org/">' +
            '<FiltroAsist>' +
              '<FechaDesde>' + fecha_desde + '</FechaDesde>'+
              '<FechaHasta>' + fecha_hasta + '</FechaHasta>'+
              '<NombreTrabajador></NombreTrabajador>'+
              '<Dni></Dni>'+
              '<NoPresentado>0</NoPresentado>'+
              '<NifClienteConsultor>' + nifConsultor + '</NifClienteConsultor>'+
            '</FiltroAsist>' +
          '</ObtenerCitasPendientesRelacion>' +
        '</soap:Body>' +
      '</soap:Envelope>';

      xmlhttp.onreadystatechange =  () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    const obj: RespuestaCitasPendientes = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    // tslint:disable-next-line: max-line-length
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
                  console.log('200 ' + xmlhttp.response);
                  this.usuarioService.presentAlert("Error","Cliente "+ this.usuarioService.empresaConsultor.NombreCliente + " no encontrado","Póngase en contacto con atención al cliente atencionalcliente@grupompe.es");
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
      this. getCitasPendientes();
      this.listaCitas = this.citasService.getCertificados();
    });
    return await modal.present();
  }
}
