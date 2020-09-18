import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Noticia } from '../../../interfaces/interfaces-grupo-mpe';

import {  NavController, Platform } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-noticias-mas-info',
  templateUrl: './noticias-mas-info.page.html',
  styleUrls: ['./noticias-mas-info.page.scss'],
})
export class NoticiasMasInfoPage implements OnInit {

  noticia: Noticia;

  constructor(  private route: ActivatedRoute,
                private platform: Platform) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.noticia = JSON.parse(params.noticia);
    });
    console.log('NOTICIA:', this.noticia.FechaFin)

  }


  vistarWeb() {

    window.open(this.noticia.Url, '_system');

  }

}
