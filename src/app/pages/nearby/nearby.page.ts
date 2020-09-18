import { Component, OnInit } from '@angular/core';
import { NavController, ViewWillEnter } from '@ionic/angular';

import { PropertyService, TranslateProvider } from '../../providers';

import { environment } from '../../../environments/environment';
import { MapasService } from '../../services/mapas.service';
import { CentroAPI } from '../../interfaces/centros-interfaces';

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.page.html',
  styleUrls: ['./nearby.page.scss'],
})
export class NearbyPage implements ViewWillEnter{
  agmStyles = environment.agmStyles;
  nearProperties: Array<any>;
  arrayCentros: CentroAPI[];

  constructor(
    public navCtrl: NavController,
    public service: PropertyService,
    private translate: TranslateProvider,
    private mapasService: MapasService
  ) {
    this.findAll();
  }



  ionViewWillEnter() {

  }

  findAll() {
    this.arrayCentros = this.mapasService.getCentrosGuardados();

  }

}
