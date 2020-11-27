import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController, NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagenTestMantoux } from 'src/app/interfaces/interfaces-grupo-mpe';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';
import { UsuarioService } from '../../../services/usuario.service';
import * as moment from 'moment';
import { DatosMantoux } from '../../../interfaces/interfaces-grupo-mpe';


@Component({
  selector: 'app-vista-tubirculina',
  templateUrl: './vista-tubirculina.page.html',
  styleUrls: ['./vista-tubirculina.page.scss'],
})
export class VistaTubirculinaPage implements OnInit {

  isImagenAdjuntada: boolean;
  imagenesRespuesta: ImagenTestMantoux[] = [];
  imagenAdjuntada: any;
  usuario: UsuarioLogin;
  fechaImagen: string;
  noTieneMantoux = false;




  constructor(private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private toastController: ToastController,
              private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private alertController: AlertController
    ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    console.log('usuario ngonit ', this.usuario);
    if (this.usuario !== undefined && this.usuario !== null  && this.usuario.HacerMantoux !== undefined && this.usuario.HacerMantoux !== null && this.usuario.HacerMantoux.toString() !== 'true') {
      console.log('usuario ngonit2 ', this.usuario);
      this.noTieneMantoux = true;
    } else if (this.usuario !== undefined && this.usuario !== null  && this.usuario.HacerMantoux !== undefined && (this.usuario.HacerMantoux === null || this.usuario.HacerMantoux.toString() === 'false')) {

      this.noTieneMantoux = true;

      } else {

        const fechaPrueba = moment(this.usuario.FechaMantoux);
        const fecha48h = moment(this.usuario.FechaMantoux).add(2, 'days');
        const fecha48hAux = moment(this.usuario.FechaMantoux).add(2, 'days');
        const fecha60h = moment(fecha48h).add(1440, 'minutes');
        const aux = moment();

        console.log('fecha60h ', fecha60h);
        let hora1: string;
        let hora2: string;




        if (!fecha48h.format('LTS').includes('AM')) {

          hora1 = fecha48h.format('hh:mm');

        } else {

          hora1 = fecha48h.format('HH:mm');

        }

        console.log(fecha60h.format('LTS'));

        if (fecha60h.format('LTS').includes('AM')) {

          hora2 = fecha60h.format('hh:mm');

        } else {

          hora2 = fecha60h.format('HH:mm');

        }




        const mensajeAlert = 'Su plazo para realizar la prueba es entre el dia ' + fecha48h.format('DD/MM/YYYY') +
        ' y el dia ' + fecha48h.add(1440, 'minutes').format('DD/MM/YYYY');
        console.log('aux ', aux);
        console.log('fe ', fecha48hAux);
        console.log('dee ', fecha60h);

        console.log(!((fecha48hAux <= aux) && (aux <= fecha60h)));
        console.log(fecha48hAux < aux);
        console.log(aux <= fecha60h);

        if ( !((fecha48hAux <= aux) && (aux <= fecha60h))) {
          if (!(fecha48hAux <= aux)) {

            this.presentAlertNoTestMontoux('Alerta', 'Vd. No puede realizar la prueba ya que aun no se encuentra dentro de plazo' , mensajeAlert);

          } else {

            this.presentAlertNoTestMontoux('Alerta', 'Vd. No puede realizar la prueba ya que se encuentra fuera de plazo' ,
            'Su plazo ha expirado ya que han pasado mas de 72h y no ha procedido a la realización de la fotografía para su diagnóstico, dicha prueba se considera invalida sin ninguna responsabilidad para Grupo MPE');

          }
          /* const mensajeAlert = 'Su plazo para realizar la prueba era del dia ' + fecha48h.format('DD/MM/YYYY') +
                              ' a las ' + fecha48h.format('LT') + ' al dia ' + fecha60h + ' a las ' + fecha60h; */

        }

      }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Imagenes',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camara',
        icon: 'camera-outline',
        handler: () => {
          const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true,
            targetWidth: 500,
            targetHeight: 500,
          };
          this.subirImagen(options);
        }
      }, {
        text: 'Galeria',
        icon: 'images-outline',
        handler: () => {
          const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,

          };
          this.subirImagen(options);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'destructive',
        handler: () => {
          this.presentToast('Subida de archivo cancelada!');
        }
      }]
    });
    await actionSheet.present();
  }

  async subirImagen(opcion: CameraOptions) {
    let cancelado = false;

    await this.camera.getPicture(opcion).then(img => {

      this.imagenAdjuntada = img;
      console.log('Imagen:', img);
      this.fechaImagen = moment().locale('es').format('YYYY-MM-DD');


      this.isImagenAdjuntada = true;
    }).catch(error => {

      this.presentToast('Subida de imagen cancelada');
      console.log('ERROR', error);
      cancelado = true;

    });


  }

  finalizarTestMantoux() {
    if (this.isImagenAdjuntada) {
        this.finTestMantoux('Prueba terminada', '¿Desea enviarlo?', '');
    } else {
        this.usuarioService.presentAlert('Por favor', 'Inserter la segunda imagen.' , 'Gracias');
    }
  }

  async finTestMantoux(titulo: string, subtitulo: string, mensaje: string) {
    console.log('This respuestas fotos: ', this.imagenesRespuesta);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Envio Cancelado');

          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.enviarRespuestasMantoux();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000
    });
    toast.present();
  }

  async presentAlertNoTestMontoux(titulo: string, subtitulo: string, mensaje: string): Promise<boolean>  {
    console.log('presentAlert');
    const alerta = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cerrar',
          handler: () => {
            const navTransition = alerta.dismiss();

            this.someAsyncOperation().then(() => {
              console.log('someAsyncOperation');
              navTransition.then(() => {
                this.navCtrl.navigateRoot('tab-inicio');
              });
            });
            return false;
          }
        }
      ]
    });

    await alerta.present();
    return null;
  }

  async someAsyncOperation() {
    // await this.navController.navigateForward("/test");
  }

  enviarRespuestasMantoux() {

    try {
      let Envio = false;
      console.log('TRY');
      this.usuarioService.present('Enviando Prueba...');
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
      xmlhttp.setRequestHeader('Content-Type', 'text/xml');
      xmlhttp.responseType = 'document';
      const sr =
          '<?xml version="1.0" encoding="utf-8"?>' +

          '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soap:Header>' +
              '<AuthHeader xmlns="http://tempuri.org/">' +
                '<Usuario>' + this.usuario.Usuario + '</Usuario>' +
                '<Password>' + this.usuario.Password  + '</Password>' +
              '</AuthHeader>' +
            '</soap:Header>' +
            '<soap:Body>' +
              '<InsertarTestMantoux xmlns="http://tempuri.org/">' +
                '<Datos>' +
                  '<RespuestaTestMantouxInfo>' +
                    '<FechaFoto>' + this.fechaImagen + '</FechaFoto>' +
                    '<Foto>' + this.imagenAdjuntada  + '</Foto>' +
                  '</RespuestaTestMantouxInfo>' +
                  '<RespuestaTestMantouxInfo>' +
                  '<FechaFoto>1900-01-01T00:00:00</FechaFoto>' +
                  '<Foto></Foto>' +
                  '</RespuestaTestMantouxInfo>' +
                '</Datos>' +
              '</InsertarTestMantoux>' +
            '</soap:Body>' +
          '</soap:Envelope>';

      console.log('STR PARA LA API: ', sr);


      xmlhttp.onreadystatechange = () => {
        console.log('FALLO 00');

        if (xmlhttp.readyState === 4 && !Envio) {
          Envio = true;
          if (xmlhttp.status === 200) {
              const xml = xmlhttp.responseXML;
              console.log('Codigo 200: ', xml);
              this.usuarioService.dismiss();
              this.usuarioService.presentAlert('Enhorabuena!!', 'Su prueba ha sido enviada con éxito !!', '');
              this.usuario.HacerMantoux = false;
              console.log('This usuario al actualizar usuario: ', this.usuario);
              this.usuarioService.actualizarPerfil(this.usuario);
              this.navCtrl.navigateRoot('/tab-inicio');
            } else {
              this.usuarioService.dismiss();
              console.log('Error 1');
              this.usuarioService.presentAlert('Fallo!!', 'Su prueba no ha podido ser enviada!!', 'Intentelo de nuevo más tarde');
              console.log('200 ' + xmlhttp.response);
            }
        } else {
          if (!Envio) {
            console.log('FALLO 2');
            console.log('4 ' + xmlhttp.status);
          }
        }
      };

      xmlhttp.send(sr);

    } catch (error) {
      console.log('error ', error);
      this.usuarioService.dismiss();
      this.usuarioService.presentAlert('Fallo!!', 'Su prueba no ha podido ser enviada!!', 'Intentelo de nuevo más tarde');
    }

  }

}
