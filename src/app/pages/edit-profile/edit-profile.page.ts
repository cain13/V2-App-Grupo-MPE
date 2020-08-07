import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CambiarPasswordPage } from '../vistasMPE/cambiar-password/cambiar-password.page';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  Nombre = "";
  Tipo = "";
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private translate: TranslateProvider,
    private usuarioService: UsuarioService,
    ) { }

  ngOnInit() {
    this.Nombre = this.usuarioService.usuario.Nombre;
    this.Tipo = this.usuarioService.usuario.Tipo;
  }

  async sendData() {
    // send booking info
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        cssClass: 'bg-profile',
        message: 'Su información a sido modificada!',
        duration: 3000,
        position: 'bottom',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });

      toast.present();
      this.navCtrl.navigateForward('/home-location');
    });
    // end
  }
  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: CambiarPasswordPage
    });
    return await modal.present();
  }
  CambiarPassword(){
    this.navCtrl.navigateForward('/CambiarPassword');
  }

  editarImagen(){
    this.usuarioService.presentToast("Esta funcionalidad no esta disponible en este momento...");
  }

}
