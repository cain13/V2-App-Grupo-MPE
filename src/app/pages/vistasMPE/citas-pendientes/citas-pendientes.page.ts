import { Component, OnInit, ViewChild } from '@angular/core';
import { RespuestaAsistenciaInfo, RespuestaAsistencia, RespuestaCitasPendientes, RespuestaCitasInfo } from 'src/app/interfaces/interfaces-grupo-mpe';
import { PopoverController, ModalController, ViewDidLeave, ViewWillEnter, IonInfiniteScroll } from '@ionic/angular';
import { PropertyService } from 'src/app/providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { DocumentosTrabajadoresService } from 'src/app/services/documentos-trabajadores.service';
import * as moment from 'moment';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { FiltroAsistenciaPage } from '../../modal/filtro-asistencia/filtro-asistencia.page';
import { EmpresaConsultor, UsuarioLogin, DatosFiltros } from 'src/app/interfaces/usuario-interfaces';
import { SeleccionarClientePage } from '../../modal/seleccionar-cliente/seleccionar-cliente.page';
import { Asistencia } from '../../../interfaces/interfaces-grupo-mpe';
import { CitasPendientesService } from '../../../services/citas-pendientes.service';
import { FiltroCitasPage } from '../../modal/filtro-citas/filtro-citas.page';


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

export class CitasPendientesPage implements OnInit, ViewDidLeave {
  searchKey = '';
  listaAsistencias = [];
  usuario: UsuarioLogin;
  empresaCoonsultor: EmpresaConsultor;
  hayConsultor = false;
  pagina = 0;
  filtros: DatosFiltros;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private asistenciaService: AsistenciaService,
    private citasService: CitasPendientesService
    ) {
      this.usuario = this.usuarioService.getUsuario();
      this.empresaCoonsultor = this.usuarioService.getEmpresaConsultor();
      if (this.usuario.Tipo === 'CONSULTOR') {
        if (this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
          this.hayConsultor = true;
        }
      }
    }

  ngOnInit() {
    this.getAsistencias();
  }

  ionViewDidLeave() {
    this.pagina = 0;
    console.log('this.infiniteScroll.disabled 1 ', this.infiniteScroll.disabled);
    if (this.infiniteScroll.disabled === true ) {
      this.infiniteScroll.disabled = false;
      console.log('this.infiniteScroll.disabled ', this.infiniteScroll.disabled);
    }
  }

  getAsistencias(event?) {

    let aux: Asistencia[];
    console.log('event ', event);
    console.log('getAsistencias filtros ', this.filtros);
    if (this.filtros !== undefined && this.filtros !== null) {
      console.log('PRIMER IF');
      try {
        if (event === undefined || event === null && this.pagina === 0) {
          this.pagina = 0;
          this.listaAsistencias = [];
          console.log('Numero pagina1 ', this.pagina);
          this.usuarioService.present('Cargando...');
        }

        let nifConsultor = '';
        if (this.usuario.Tipo === 'CONSULTOR') {
          if (this.empresaCoonsultor !== undefined && this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
            nifConsultor = this.empresaCoonsultor.Nif;
          }
        }
        const fecha_desde = moment().format('YYYY-MM-DDT00:00:00');
        const fecha_hasta = moment().add(1, 'month').format('YYYY-MM-DDT00:00:00');
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);

        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
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
                '<FechaDesde>' + fecha_desde + '</FechaDesde>' +
                '<FechaHasta>' + fecha_hasta + '</FechaHasta>' +
                '<NombreTrabajador>' + this.filtros.nombre + '</NombreTrabajador>' +
                '<Dni>' + this.filtros.dni + '</Dni>' +
                '<NoPresentado>' + this.filtros.noPresentado + '</NoPresentado>' +
                '<NifClienteConsultor>' + nifConsultor + '</NifClienteConsultor>' +
              '</FiltroAsist>' +
              '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
              '<NumeroRegistro>20</NumeroRegistro>' +
            '</ObtenerCitasPendientesRelacion>' +
          '</soap:Body>' +
        '</soap:Envelope>';

        console.log('sr:', sr);

        xmlhttp.onreadystatechange =  () => {
              if (xmlhttp.readyState === 4) {
                  if (xmlhttp.status === 200) {
                      const xml = xmlhttp.responseXML;
                      const obj: RespuestaCitasPendientes = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                      // tslint:disable-next-line: max-line-length
                      const a: RespuestaCitasInfo = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCitasPendientesRelacionResponse']['ObtenerCitasPendientesRelacionResult']));
                      console.log(a);
                      if (a.AsistenciaInfo !== undefined) {
                        if (!Array.isArray(a.AsistenciaInfo)) {

                          this.listaAsistencias.push(a.AsistenciaInfo);
                          aux = a.AsistenciaInfo;

                        } else {

                          for (const cert of a.AsistenciaInfo) {

                            this.listaAsistencias.push(cert);

                          }

                          aux = a.AsistenciaInfo;
                        }


                        this.asistenciaService.setAsistencia(this.listaAsistencias);
                        console.log('ListaAsistencia1 ' + this.listaAsistencias);
                        console.log('EVENT 1: ', event);

                  } else {
                    this.usuarioService.dismiss();
                    if (this.usuario.Tipo === 'CONSULTOR') {
                      // tslint:disable-next-line: max-line-length
                      this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
                    }
                  }
                  if ( event !== undefined && event !== null) {
                    event.target.complete();
                    console.log('AUXXXX: ', aux);
                    if ( Array.isArray(aux) ) {
                      if (aux.length < 20) {
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
          };
        xmlhttp.send(sr);

      } catch (error) {
        this.usuarioService.dismiss();
      }


    } else {
      try {
        console.log('ELSEEE', event);
        if (event === undefined || event === null && this.pagina === 0) {
          console.log('ELSEEE');

          this.pagina = 0;
          console.log('Numero pagina ', this.pagina);
          this.usuarioService.present('Cargando...');
        }

        let nifConsultor = '';
        if (this.usuario.Tipo === 'CONSULTOR') {
          if (this.empresaCoonsultor !== undefined && this.empresaCoonsultor.NombreCliente !== undefined && this.empresaCoonsultor.NombreCliente !== null) {
            nifConsultor = this.empresaCoonsultor.Nif;
          }
        }
        const fecha_desde = moment().format('YYYY-MM-DDT00:00:00');
        const fecha_hasta = moment().add(1, 'month').format('YYYY-MM-DDT00:00:00');
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
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
                '<FechaDesde>' + fecha_desde + '</FechaDesde>' +
                '<FechaHasta>' + fecha_hasta + '</FechaHasta>' +
                '<NombreTrabajador></NombreTrabajador>' +
                '<Dni></Dni>' +
                '<NoPresentado>0</NoPresentado>' +
                '<NifClienteConsultor>' + nifConsultor + '</NifClienteConsultor>' +
              '</FiltroAsist>' +
              '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
              '<NumeroRegistro>20</NumeroRegistro>' +
            '</ObtenerCitasPendientesRelacion>' +
          '</soap:Body>' +
        '</soap:Envelope>';

        xmlhttp.onreadystatechange =  () => {
              if (xmlhttp.readyState === 4) {
                  if (xmlhttp.status === 200) {
                      const xml = xmlhttp.responseXML;
                      console.log('XML sr', sr);
                      const obj: RespuestaAsistencia = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                      // tslint:disable-next-line: max-line-length
                      const a: RespuestaAsistenciaInfo = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCitasPendientesRelacionResponse']['ObtenerCitasPendientesRelacionResult']));
                      console.log(a);
                      if (a.AsistenciaInfo !== undefined) {
                        if (!Array.isArray(a.AsistenciaInfo)) {
                          this.listaAsistencias.push(a.AsistenciaInfo);
                          aux = a.AsistenciaInfo;
                        } else {
                          for (const cert of a.AsistenciaInfo) {
                            this.listaAsistencias.push(cert);
                          }
                          aux = a.AsistenciaInfo;
                        }
                      this.asistenciaService.setAsistencia(this.listaAsistencias);
                      console.log('ListaAsistencia2 ' + this.listaAsistencias);
                      console.log('EVENT 2: ', event);

                      if ( event !== undefined && event !== null) {
                        event.target.complete();
                        console.log('AUXXXX: ', aux);
                        if ( Array.isArray(aux) ) {
                          if (aux.length < 20) {
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
                    if (this.usuario.Tipo === 'CONSULTOR') {
                      // tslint:disable-next-line: max-line-length
                      this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
                    }
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
    this.pagina = this.pagina + 1;
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
      component: FiltroCitasPage
    });
    modal.onDidDismiss().then(() => {

     /*  if (this.usuarioService.haFiltradoAsistencia) {
        this.getAsistencias(null,this.citasService.getFiltrosCitas());
      } */
      this.pagina = 0;
      console.log('this.citasService.getFiltrosCitas: ', this.citasService.getFiltrosCitas());
      this.filtros = this.citasService.getFiltrosCitas();
      this.getAsistencias(null);


    });
    return await modal.present();
  }

  findAll() {
    this.listaAsistencias = this.asistenciaService.getAsistencias();
  }
  masInfo() {

  }

  seleccionarEmpresa() {
    this.vistaSeleccionarEmpresa();
  }

  async vistaSeleccionarEmpresa() {
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
