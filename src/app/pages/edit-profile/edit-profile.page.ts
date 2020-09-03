import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CambiarPasswordPage } from '../vistasMPE/cambiar-password/cambiar-password.page';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  Nombre = '';
  Tipo = '';
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private translate: TranslateProvider,
    private usuarioService: UsuarioService,
    private alertController: AlertController
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
  async cambiarPassword () {
    const modal = await this.modalCtrl.create({
      component: CambiarPasswordPage
    });
    return await modal.present();
  }
  cambiarUsuario() {
    this.navCtrl.navigateForward('/login');
  }

  editarImagen() {
    this.usuarioService.presentToast('Esta funcionalidad no esta disponible en este momento...');
  }

  Borrardatos() {
    this.presentAlertConfirm();
  }

 async presentAlertConfirm() {
    const alert = await this.alertController.create({

      header: 'Confirmar!',
      message: '<strong>¿Desa salir y borrar los datos de acceso?<strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Salir',
          handler: () => {
            console.log('Confirm Okay');
            this.usuarioService.BorrarEmpleado();
            this.usuarioService.guardarUsuario(null);
            this.navCtrl.navigateRoot('blanco');
          }
        }
      ]
    });

    await alert.present();
  }
}
