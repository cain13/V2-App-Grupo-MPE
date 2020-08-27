import { Component, OnInit, ViewChild } from '@angular/core';
import { RespuestaCitasPendientes, RespuestaCitasInfo, RespuestaCitasEmpleado, RespuestaCitasEmpleadoaInfo, Asistencia } from 'src/app/interfaces/interfaces-grupo-mpe';
import { PopoverController, ModalController, IonInfiniteScroll, ViewDidLeave } from '@ionic/angular';
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
  selector: 'app-citas-pendientes-trabajador',
  templateUrl: './citas-pendientes-trabajador.page.html',
  styleUrls: ['./citas-pendientes-trabajador.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translate3d(100px,0,0)' }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: 'translate3d(0,0,0)' }))]), { optional: true })
      ])
    ])
  ]
})

export class CitasPendientesTrabajadorPage implements OnInit {
  searchKey = '';
  listaCitas = [];
  usuario: UsuarioLogin;
  hayConsultor = false;
  pagina = 0;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public popoverCtrl: PopoverController,
    public service: PropertyService,
    public modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private citasService: CitasPendientesService
    ) {
      this.usuario = this.usuarioService.getUsuario();
    }

    ngOnInit() {
      this.getCitasPendientes();
    }
  
    ionViewDidLeave(){
      this.pagina = 0;
      console.log("this.infiniteScroll.disabled 1 ", this.infiniteScroll.disabled);
      if (this.infiniteScroll.disabled === true ) {
        this.infiniteScroll.disabled = false;
        console.log("this.infiniteScroll.disabled ", this.infiniteScroll.disabled);
      }
    }
  
    getCitasPendientes(event?) {
  
      let aux: Asistencia[];
  
      try {
        if(event === undefined || event === null && this.pagina === 0){
          this.pagina=0;
          console.log("Numero pagina ", this.pagina);
          this.usuarioService.present('Cargando Citas...');
        }
        let nifConsultor = '';
      
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
            '<ObtenerTrabajadorCitasPendientesRelacion  xmlns="http://tempuri.org/">' +
              '<NumeroPagina>' + this.pagina + '</NumeroPagina>' +
              '<NumeroRegistro>20</NumeroRegistro>' +
            '</ObtenerTrabajadorCitasPendientesRelacion >' +
          '</soap:Body>' +
        '</soap:Envelope>';
  
        xmlhttp.onreadystatechange =  () => {
              if (xmlhttp.readyState === 4) {
                  if (xmlhttp.status === 200) {
                      const xml = xmlhttp.responseXML;
                      const obj: RespuestaCitasEmpleado = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                      // tslint:disable-next-line: max-line-length
                      console.log('Respuesta: ', obj);
  
                      const a: RespuestaCitasEmpleadoaInfo = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerTrabajadorCitasPendientesRelacionResponse']['ObtenerTrabajadorCitasPendientesRelacionResult']));
                      console.log(a);
  
                      if (a.AsistenciaInfo !== undefined) {
                        if (!Array.isArray(a.AsistenciaInfo)) {
  
                          this.listaCitas.push(a.AsistenciaInfo);
                        } else {
                          for (const cert of a.AsistenciaInfo) {
                            this.listaCitas.push(cert);
                          }
                          aux = a.AsistenciaInfo;
                        }
  
                      this.citasService.setCitaPendiente(this.listaCitas);
                      console.log('ListaHistorial ' + this.listaCitas);
                      console.log('event ' ,event);
                      if ( event !== undefined) {
                        event.target.complete();
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
                    console.log('200 ' + xmlhttp.response);
                    // tslint:disable-next-line: max-line-length
                    this.usuarioService.presentAlert('Error', 'Cliente ' + this.usuarioService.empresaConsultor.NombreCliente + ' no encontrado', 'Póngase en contacto con atención al cliente atencionalcliente@grupompe.es');
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
  
    seleccionarEmpresa() {
      this.vistaSeleccionarEmpresa();
    }
  
    async vistaSeleccionarEmpresa() {
      const modal = await this.modalCtrl.create({
        component: SeleccionarClientePage
      });
      modal.onDidDismiss().then(() => {
        console.log('Entra a modal seleccionar cliente');
        this. getCitasPendientes();
        this.listaCitas = this.citasService.getCertificados();
      });
      return await modal.present();
    }
}
  