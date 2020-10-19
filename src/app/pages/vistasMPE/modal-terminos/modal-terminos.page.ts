import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modal-terminos',
  templateUrl: './modal-terminos.page.html',
  styleUrls: ['./modal-terminos.page.scss'],
})
export class ModalTerminosPage implements OnInit {

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {

/*     this.presentAlert('Para poder acceder, debe aceptar los términos de la aplicación.', 'Por favor');
 */
  }

  aceptarTerminos() {
    this.modalCtrl.dismiss({
      'aceptarDatos': true
    });
  }

  async presentAlert(subtitulo: string, mensaje: string) {
    let error = 'Error';
    if (mensaje.length > 0) {
      error = mensaje;
    } else {
      mensaje = 'Error';
    }
    console.log('PRESENT ALERT');
    const alert = await this.alertCtrl.create({
      header: mensaje,
      subHeader: subtitulo,
      message: '',
      buttons: [
        {
          text: 'Ver más tarde',
          handler: () => {
            this.modalCtrl.dismiss({
              'aceptarDatos': false
            });

          }
        }, {
          text: 'Ver términos ahora',
          handler: async () => {

            console.log('PRESENT ALERT: VER TERMINOOOOS');

          }
        }
      ]
    });

    await alert.present();
  }

}