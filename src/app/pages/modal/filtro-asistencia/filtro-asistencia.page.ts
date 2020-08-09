import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UsuarioService } from '../../../services/usuario.service';
import { Centro, RespuestaGetAPICertificadosAptitud, ObtenerCertificados, RespuestaHistorial, ObtenerHistoriaDocumentos, RespuestaAsistencia, RespuestaAsistenciaInfo } from '../../../interfaces/interfaces-grupo-mpe';
import * as moment from 'moment';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { AsistenciaService } from 'src/app/services/asistencia.service';

@Component({
  selector: 'app-filtro-asistencia',
  templateUrl: './filtro-asistencia.page.html',
  styleUrls: ['./filtro-asistencia.page.scss'],
})
export class FiltroAsistenciaPage implements OnInit {

  organizeby: any;
  proptype: any;
  wantslabel: any;
  centros: Centro[];

  usuario: UsuarioLogin;
  listaAsistencias = [];
  ultimoMes = false;
  ultimoTrimestre = false;
  anioActual = false;
  anioAnterior = false;


  filtro_dni = '';
  filtro_desde: Date = null;
  filtro_hasta: Date = null;
  filtro_nombre = '';
  filtro_noPresentado: boolean;


  constructor(private modalCtrl: ModalController, private usuarioService: UsuarioService,
              private ngxXml2jsonService: NgxXml2jsonService, private navCtrl: NavController,
              private asistenciaService:AsistenciaService ) { }


  ngOnInit() {
    this.centros = this.usuarioService.getCentros();
    this.usuario = this.usuarioService.getUsuario();
    
  }



  closeModal() {

    this.modalCtrl.dismiss();

  }

  filtrar() {
    let fecha_desde_aux: string;
    let fecha_hasta_aux: string;

    if (this.filtro_desde === null) {

     fecha_desde_aux = '1900-01-01T00:00:00';
    } else {

      fecha_desde_aux = moment(this.filtro_desde.toString()).format('YYYY-MM-DDT00:00:00');

    }

    if (this.filtro_hasta === null) {

      fecha_hasta_aux = moment().format('YYYY-MM-DDT00:00:00');
    } else {

      fecha_hasta_aux = moment(this.filtro_hasta.toString()).add(1, 'days').format('YYYY-MM-DDT00:00:00');

    }
    if (this.filtro_noPresentado === undefined) {

      this.filtro_noPresentado = false;

    }


    console.log('DESDE', fecha_desde_aux);
    console.log('HASTA', fecha_hasta_aux);
    console.log('NOMBRE', this.filtro_nombre);
    console.log('DNI', this.filtro_dni);
    console.log('filtro_noPresentado ', this.filtro_noPresentado);

    this.getCertificados(fecha_desde_aux, fecha_hasta_aux, this.filtro_nombre, this.filtro_dni, this.filtro_noPresentado);

  }


  getCertificados(fechaDesde: string, fechaHasta: string, nombre: string, dni: string, noPresentado: boolean) {

    try{
      this.usuarioService.present("Cargando...");
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
              '<FechaDesde>' + fechaDesde + '</FechaDesde>'+
              '<FechaHasta>' + fechaHasta + '</FechaHasta>'+
              '<NombreTrabajador>' + nombre + '</NombreTrabajador>' +
              '<Dni>' + dni + '</Dni>' +
              '<NoPresentado>' + noPresentado + '</NoPresentado>'+
              '<NifClienteConsultor></NifClienteConsultor>'+
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
                    this.usuarioService.guardarAsistencias(this.listaAsistencias);
                    this.closeModal();
                    this.usuarioService.dismiss();
                }else{
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

  ultimoMesF() {

    const fechaDesde = moment().add(-1, 'month').format('YYYY-MM-DDT00:00:00');
    this.filtro_desde = new Date(fechaDesde);
    this.filtrar();
  }

  ultimoTrimestreF() {

    const fechaDesde = moment().add(-3, 'month').format('YYYY-MM-DDT00:00:00');
    this.filtro_desde = new Date(fechaDesde);
    this.filtrar();

  }

  anioAnteriorF() {
    const anio = moment().year() - 1 ;
    const desdeAux = anio + '/01/01';
    const hastaAux = anio + '/12/31';
    this.filtro_desde = new Date(desdeAux);
    this.filtro_hasta = new Date(hastaAux);
    this.filtrar();

  }

  anioActualF() {

    const anio = moment().year();
    const desdeAux = anio + '/01/01';
    const hastaAux = anio + '/12/31';
    this.filtro_desde = new Date(desdeAux);
    this.filtro_hasta = new Date(hastaAux);
    this.filtrar();


  }
}
