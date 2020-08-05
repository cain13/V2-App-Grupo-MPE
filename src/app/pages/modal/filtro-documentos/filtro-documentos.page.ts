import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filtro-documentos',
  templateUrl: './filtro-documentos.page.html',
  styleUrls: ['./filtro-documentos.page.scss'],
})
export class FiltroDocumentosPage implements OnInit {
  organizeby: any;
  proptype: any;
  wantslabel: any;

  public radiusmiles = 1;
  public minmaxprice = {
    upper: 5000000,
    lower: 100000
  };

  constructor(private modalCtrl: ModalController) { }


  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
