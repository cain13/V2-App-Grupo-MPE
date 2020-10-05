import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-condiciones',
  templateUrl: './modal-condiciones.page.html',
  styleUrls: ['./modal-condiciones.page.scss'],
})
export class ModalCondicionesPage implements OnInit {

  constructor(public modalCtrl: ModalController,
    ) { }

  ngOnInit() {
  }

  aceptarTerminos() {

    this.modalCtrl.dismiss();

  }

}
