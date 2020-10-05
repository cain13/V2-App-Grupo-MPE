import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CambiarPasswordPage } from '../vistasMPE/cambiar-password/cambiar-password.page';
import { UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  Nombre = '';
  Tipo = '';
  Email = '';
  Telefono = '';

  usuario: UsuarioLogin;
  EsGuardiaCivil = false;
  public editProfileForm: FormGroup;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private translate: TranslateProvider,
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,

    ) { }

  ngOnInit() {

    this.Nombre = this.usuarioService.usuario.Nombre;
    this.Tipo = this.usuarioService.usuario.Tipo;
    this.usuario = this.usuarioService.getUsuario();
    if (this.usuario.EsGuardiaCivil !== undefined && this.usuario.EsGuardiaCivil.toString() === 'true'){
      this.Nombre = 'GUARDIA CIVIL';
      this.Tipo = this.usuarioService.usuario.Nombre;
      this.EsGuardiaCivil = true;
      this.Email = this.usuario.Email;
      this.Telefono = this.usuario.Telefono;
    }

    if (this.EsGuardiaCivil) {
      this.editProfileForm = this.formBuilder.group({
        nombre: [this.usuario.Nombre.toString(), Validators.compose([
          Validators.required
        ])],
        telefono: [this.usuario.Telefono.toString(), Validators.compose([
          Validators.required
        ])],
        movil: [this.usuario.Movil.toString(), Validators.compose([
          Validators.required
        ])],
        email: [this.usuario.Email.toString(), Validators.compose([
          Validators.required
        ])]
      });

    } else {

      this.editProfileForm = this.formBuilder.group({
        nombre: [this.usuario.Nombre.toString(), Validators.compose([
          Validators.required
        ])],
        tipo: [this.usuario.Tipo.toString(), Validators.compose([
          Validators.required
        ])]
      });

    }


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

  guardarCambios() {
    try {
      this.usuarioService.present('Actualizando datos...');
      const xmlhttp = new XMLHttpRequest();


      xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
/*       xmlhttp.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
 */      xmlhttp.setRequestHeader('content-type', 'text/xml');
/*       xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
 */
      console.log('HEADER2: ', xmlhttp.getResponseHeader);
      xmlhttp.responseType = 'document';
        // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
      const sr =
          '<?xml version="1.0" encoding="utf-8"?>' +
          '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soap:Header>' +
              '<AuthHeader xmlns="http://tempuri.org/">' +
                '<Usuario>' + this.usuario.Usuario + '</Usuario>' +
                '<Password>' + this.usuario.Password + '</Password>' +
              '</AuthHeader>' +
            '</soap:Header>' +
            '<soap:Body>' +
              '<InsertarDatosTrabajador xmlns="http://tempuri.org/">' +
                '<Datos>' +
                  '<Nombre>' + this.editProfileForm.value.nombre + '</Nombre>' +
                  '<Movil>' + this.editProfileForm.value.movil + '</Movil>' +
                  '<Telefono>' + this.editProfileForm.value.telefono + '</Telefono>' +
                  '<Email>' + this.editProfileForm.value.email + '</Email>' +
                '</Datos>' +
              '</InsertarDatosTrabajador>' +
            '</soap:Body>' +
          '</soap:Envelope>';


      console.log('MENSAJE MANDADO A LA API:', sr);
      xmlhttp.onreadystatechange = () => {
        console.log('XMLHTTP: ', xmlhttp);
            if (xmlhttp.readyState === 4) {

                const aux: UsuarioLogin = this.usuario;
                aux.Email = this.editProfileForm.value.email;
                aux.Nombre = this.editProfileForm.value.nombre;
                aux.Telefono = this.editProfileForm.value.telefono;
                aux.Movil = this.editProfileForm.value.movil;

                if (aux.Email === null) {
                  aux.Email = '';
                }
                if (aux.Nombre === null) {
                  aux.Nombre = '';
                }
                if (aux.Telefono === null) {
                  aux.Telefono = '';
                }
                if (aux.Movil === null) {
                  aux.Movil = '';
                }


                if (xmlhttp.status === 200) {

                  this.usuarioService.actualizarPerfil(aux);
                  this.usuarioService.presentToast('Datos actualizados correctamente');

                } else if (xmlhttp.status === 500 ) {
                  this.usuarioService.presentAlert('Error', 'Fallo al actualizar datos', 'Intentelo de nuevo más tarde');
                }
            }
            this.usuarioService.dismiss();
        };

        console.log('XMLHTTP: ', xmlhttp);
      xmlhttp.send(sr);
    } catch (error) {
      this.usuarioService.dismiss();
    }

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
            this.navCtrl.navigateRoot('login');
          }
        }
      ]
    });

    await alert.present();
  }
}
