import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UsuarioService } from '../../../services/usuario.service';
import { Centro, RespuestaGetAPICertificadosAptitud, ObtenerCertificados, RespuestaCitasPendientes, RespuestaCitasInfo } from '../../../interfaces/interfaces-grupo-mpe';
import * as moment from 'moment';
import { UsuarioLogin, DatosFiltros } from '../../../interfaces/usuario-interfaces';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { CitasPendientesService } from '../../../services/citas-pendientes.service';

@Component({
  selector: 'app-filtro-citas',
  templateUrl: './filtro-citas.page.html',
  styleUrls: ['./filtro-citas.page.scss'],
})
export class FiltroCitasPage implements OnInit {
  organizeby: any;
  proptype: any;
  wantslabel: any;
  centros: Centro[];

  usuario: UsuarioLogin;
  listaCitas = [];
  ultimoMes = false;
  ultimoTrimestre = false;
  anioActual = false;
  anioAnterior = false;
  pagina = 0;

  filtro_dni = '';
/*   filtro_desde = moment('01/01/1900').format('DD/MM/YYYY').toString();
  filtro_hasta = moment().locale('es').format('DD/MM/YYYY').toString(); */
  filtro_desde: Date = null;
  filtro_hasta: Date = null;
  filtro_nombre = '';
  filtro_idCentro: string;
  filtro_idCentroEspecificado = 0;
  filtro_noPresentado: boolean;

  constructor(private modalCtrl: ModalController, private usuarioService: UsuarioService,
              private ngxXml2jsonService: NgxXml2jsonService, private navCtrl: NavController, private citasService: CitasPendientesService ) { }


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

     fecha_desde_aux = moment().format('YYYY-MM-DDT00:00:00');
    } else {

      fecha_desde_aux = moment(this.filtro_desde.toString()).format('YYYY-MM-DDT00:00:00');

    }

    if (this.filtro_hasta === null) {

      fecha_hasta_aux = moment().format('YYYY-MM-DDT00:00:00');
    } else {

      fecha_hasta_aux = moment(this.filtro_hasta.toString()).add(8, 'days').format('YYYY-MM-DDT00:00:00');

    }
    if (this.filtro_noPresentado === undefined) {

      this.filtro_noPresentado = false;

    }


    console.log('DESDE', fecha_desde_aux);
    console.log('HASTA', fecha_hasta_aux);
    console.log('NOMBRE', this.filtro_nombre);
    console.log('DNI', this.filtro_dni);
    console.log('filtro_noPresentado ', this.filtro_noPresentado);

    const filtros: DatosFiltros = {
      fecha_desde: fecha_desde_aux,
      fecha_hasta: fecha_hasta_aux,
      nombre: this.filtro_nombre,
      dni: this.filtro_dni,
      noPresentado: this.filtro_noPresentado,
    }
    console.log('FILTROS: ', filtros);
    this.citasService.guardarFiltrosCitas(filtros);
    this.closeModal();

/*    
 this.getCitas(fecha_desde_aux, fecha_hasta_aux, this.filtro_nombre, this.filtro_dni, this.filtro_noPresentado);
 */
  }


  /* getCitas(fechaDesde: string, fechaHasta: string, nombre: string, dni: string, noPresentado: boolean) {

    try {
      let nifConsultor = '';
      if (this.usuario.Tipo === 'CONSULTOR') {
        nifConsultor = this.usuarioService.empresaConsultor.Nif;
      }
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
              '<FiltroAsist>' +
                '<FechaDesde>' + fechaDesde + '</FechaDesde>' +
                '<FechaHasta>' + fechaHasta + '</FechaHasta>' +
                '<NombreTrabajador>' + nombre + '</NombreTrabajador>' +
                '<Dni>' + dni + '</Dni>' +
                '<NoPresentado>' + noPresentado + '</NoPresentado>' +
                '<NifClienteConsultor>' + nifConsultor + '</NifClienteConsultor>' +
              '</FiltroAsist>' +
              '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
            '<NumeroRegistro>20</NumeroRegistro>' +
            '</ObtenerCertificadosAptitudRelacionDocumentos>' +
          '</soap:Body>' +
        '</soap:Envelope>';


      xmlhttp.onreadystatechange =  () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    const obj: RespuestaCitasPendientes = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    // tslint:disable-next-line: max-line-length
                    const a: RespuestaCitasiaInfo = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCitasPendientesRelacionResponse']['ObtenerCitasPendientesRelacionResult']));
                    if (a.RespuestaCitasiaInfo !== undefined && !Array.isArray(a.RespuestaCitasiaInfo)) {

                      this.listaCitas.push(a.CitasInfo);

                    } else {

                      this.listaCitas = a.CitasInfo;

                    }
                    console.log('Citas: ', a.CitasInfo);
                    console.log('1.', this.listaCitas);
                    this.usuarioService.dismiss();
                    this.usuarioService.guardarCitas(this.listaCitas);
                    this.closeModal();
                } else {
                  this.usuarioService.dismiss();
                  this.closeModal();
                }
            } else {
              this.usuarioService.dismiss();
              this.closeModal();
            }
        };
      xmlhttp.send(sr);
    } catch (error) {
      this.usuarioService.dismiss();
      this.closeModal();
    }

  } */

  add7dias() {
    const desdeAux = moment().format('YYYY-MM-DDT00:00:00');
    const hastaAux = moment().add(8, 'days').format('YYYY-MM-DDT00:00:00');
    this.filtro_desde = new Date(desdeAux);
    this.filtro_hasta = new Date(hastaAux);
    this.filtrar();
  }

  addMes() {
    const desdeAux = moment().format('YYYY-MM-DDT00:00:00');
    const hastaAux = moment().add(1, 'month').format('YYYY-MM-DDT00:00:00');
    this.filtro_desde = new Date(desdeAux);
    this.filtro_hasta = new Date(hastaAux);
    this.filtrar();
  }

  todasLasCitas() {
    const anio = moment().year() - 1 ;
    const desdeAux = moment().format('YYYY-MM-DDT00:00:00');
    const hastaAux =  moment().add(12, 'month').format('YYYY-MM-DDT00:00:00');
    this.filtro_desde = new Date(desdeAux);
    this.filtro_hasta = new Date(hastaAux);
    this.filtrar();

  }


}
