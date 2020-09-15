import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  NavController,
  AlertController,
  MenuController,
  LoadingController,
  ToastController,
  PopoverController,
  ModalController } from '@ionic/angular';

import { PropertyService } from '../../providers';

import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';

import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { UsuarioService } from '../../services/usuario.service';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { RespuestaCentroMPEInfo, RespuestaCentrosMPE, RespuestaCitasEmpleado, RespuestaCitasEmpleadoaInfo } from 'src/app/interfaces/interfaces-grupo-mpe';
import { CentroMPE } from '../../interfaces/interfaces-grupo-mpe';
import { CentrosMpeService } from '../../services/centros-mpe.service';


@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('200ms', [animate('400ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class HomeResultsPage {

  properties: Array<any>;
  searchKey = '';
  label = '';
  yourLocation = '463 Beacon Street Guest House';

  listaCentroMpe = [];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public service: PropertyService,
    private router: Router,
    public usuarioService: UsuarioService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private centrosMpeService: CentrosMpeService
  ) {

  }

  ionViewWillEnter() {
    this.getCentrosMpe();
  }

  getCentrosMpe() {

    try {
      let aux: CentroMPE[];
      this.usuarioService.present('Cargando Centros...');
     
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
          '<Usuario>contavila@galicia.com</Usuario>' +
          '<Password>MPEVILA</Password>' +
          '</AuthHeader>' +
        '</soap:Header>' +
        '<soap:Body>' +
          '<ObtenerCentrosMpe xmlns="http://tempuri.org/" />' +
        '</soap:Body>' +
      '</soap:Envelope>';

      xmlhttp.onreadystatechange =  () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    const obj: RespuestaCentrosMPE = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    // tslint:disable-next-line: max-line-length
                    console.log('Respuesta: ', obj);

                    // tslint:disable-next-line: max-line-length
                    const a: RespuestaCentroMPEInfo = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerTrabajadorCitasPendientesRelacionResponse']['ObtenerTrabajadorCitasPendientesRelacionResult']));
                    console.log(a);

                    if (a.CentroMpeInfo !== undefined) {
                      if (!Array.isArray(a.CentroMpeInfo)) {

                        this.listaCentroMpe.push(a.CentroMpeInfo);
                      } else {
                        for (const cent of a.CentroMpeInfo) {
                          cent.Imagen = "assets/img/properties/house12.jpg"
                          this.listaCentroMpe.push(cent);
                        }
                        aux = a.CentroMpeInfo;
                      }

                    this.centrosMpeService.setCentroMpe(this.listaCentroMpe);
                    console.log('ListaHistorial ' + this.listaCentroMpe);
                    console.log('event ' , event);
                   
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
  }
  settings() {
    this.navCtrl.navigateForward('settings');
  }

  onInput(event) {
    this.service.findByName(this.searchKey)
        .then(data => {
            this.properties = data;
        })
        .catch(error => alert(JSON.stringify(error)));
  }

  onCancel(event) {
    this.findAll();
  }

  findAll() {
    this.service.findAll()
      .then(data => this.properties = data)
      .catch(error => alert(error));

  }

  async openPropertyListPage(label?: any) {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    loader.onWillDismiss().then(() => {
      let navigationExtras: NavigationExtras = {
        state: {
          cat: '',
          label: label
        }
      };
      this.router.navigate(['property-list'], navigationExtras);
    });
  }

  async alertLocation() {
    const changeLocation = await this.alertCtrl.create({
      header: 'Change Location',
      message: 'Type your Address to change list in that area.',
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: async (data) => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            const toast = await this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              buttons: [
                {
                  text: 'Ok',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                }
              ]
            });

            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }

  async notifications() {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

}
