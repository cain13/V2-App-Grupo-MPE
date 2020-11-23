import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Noticia } from '../../../interfaces/interfaces-grupo-mpe';

import {  NavController, Platform } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-noticias-mas-info',
  templateUrl: './noticias-mas-info.page.html',
  styleUrls: ['./noticias-mas-info.page.scss'],
})
export class NoticiasMasInfoPage implements OnInit {

  noticia: Noticia;
  trustedVideoUrl: SafeResourceUrl;
  constructor(  private route: ActivatedRoute,
                private platform: Platform,
                private domSanitizer: DomSanitizer,
                private iab: InAppBrowser) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.noticia = JSON.parse(params.noticia);
      console.log('NOTICIAAAAA: ', params.noticia);
    });

    console.log('Noticia MAS INFO: ', this.noticia);

    if(this.noticia.URLYoutube !== undefined && this.noticia.URLYoutube !== null &&  this.noticia.URLYoutube.length > 0){
      let urlYoutube = "https://youtube.com/embed/";
      let splitYoutube =  this.noticia.URLYoutube.split('/');
      let file = splitYoutube[splitYoutube.length-1];
      file = file.replace('watch?v=','');
      urlYoutube += file;
      console.log('URLYOUTUBE', urlYoutube);
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(urlYoutube);
      console.log('NOTICIA:', this.noticia);
    }
  }


  vistarWeb() {

    //.open(this.noticia.Url, '_system');
    let browser = this.iab.create(this.noticia.Url, '_system');
  }

}
