import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import {
  InvoicesService,
  TranslateProvider
} from '../../../providers';

import { PropertyService } from '../../../providers';

import { SearchFilterPage } from '../../../pages/modal/search-filter/search-filter.page';

import { NotificationsComponent } from '../../../components/notifications/notifications.component';
import { FiltroDocumentosPage } from '../../modal/filtro-documentos/filtro-documentos.page';
import { DocumentosService } from '../../../providers/documentos/documentos.service';
import { CertificadosAptitudService } from '../../../providers/certificadosAptitud/certificados-aptitud.service';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { NavController, MenuController, PopoverController,
         AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-certificado-aptitud',
  templateUrl: './certificado-aptitud.page.html',
  styleUrls: ['./certificado-aptitud.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('300ms', [animate('500ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class CertificadoAptitudPage {
  listaCertificados: Array<any> = [];
  searchKey = '';
  properties: Array<any>;



  constructor(
    private router: Router,
    private certificadosServices: CertificadosAptitudService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public service: PropertyService,
  ) {
    this.getCertificados();

  }

  getCertificados() {
    this.certificadosServices.getInvoices()
      .then(data => {
        this.listaCertificados = data;
        console.log(this.listaCertificados);

      });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.findAll();
  }

  async goCheckout(invoice) {
    const navigationExtras: NavigationExtras = {
      state: {
        invoice: invoice
      }
    };

    this.router.navigate(['checkout'], navigationExtras);
  }

  onInput(event) {
    this.service.findByName(this.searchKey)
        .then(data => {
            this.properties = data;
        })
        .catch(error => alert(JSON.stringify(error)));
  }

  async notifications() {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  onCancel(event) {
    this.findAll();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: FiltroDocumentosPage
    });
    return await modal.present();
  }

  findAll() {
    this.service.findAll()
      .then(data => this.properties = data)
      .catch(error => alert(error));

  }



}
