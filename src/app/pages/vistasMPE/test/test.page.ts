import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { PopoverController, ModalController, IonCheckbox, IonRadio, AlertController, NavController, ActionSheetController, ToastController } from '@ionic/angular';
import { ElegirTestPage } from 'src/app/components/elegir-test/elegir-test.page';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';
import { UsuarioService } from '../../../services/usuario.service';
import { RespuestaAPITest, TestInfo, RespuestaTest, RespuestasTestAPI, RespuestaAPIDocumentos, ImagenTestMantoux } from 'src/app/interfaces/interfaces-grupo-mpe';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { TestService } from '../../../services/test.service';
import { SubrespuestaModalPage } from '../subrespuesta-modal/subrespuesta-modal.page';
import { SubRespuestaInfo, RespuestaSubPreguntas, RespuestaSubPreguntaInfo } from '../../../interfaces/interfaces-grupo-mpe';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {  FileTransfer, FileUploadOptions,FileTransferObject } from '@ionic-native/file-transfer/ngx';


declare var window: any;


@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  usuario: UsuarioLogin;
  test: TestInfo;
  mostrarTest = false;
  contador: number;
  respuestasTest: RespuestasTestAPI;
  isCheck = true;
  numeroPreguntas: number;
  numeroPreguntasSinResponder: number;
  isFinTest = false;
  mostrarBtnFin = false;
  testEnviadoCorrectamente = false;
  isMantoux = false;
  imagenAdjuntada: any;
  fileTransfer: FileTransferObject;

  tituloArchivo: string;
  isImagenAdjuntada: boolean;
  imagenesRespuesta: ImagenTestMantoux[] = [];





  @ViewChildren('CheckRespuesta') botonRespuestas: QueryList<IonCheckbox>;


  constructor(private modalCtrl: ModalController,
              private usuarioService: UsuarioService,
              private ngxXml2jsonService: NgxXml2jsonService,
              private testServices: TestService,
              private popoverController: PopoverController,
              private alertController: AlertController,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private toastController: ToastController,
              private camera: Camera,
              public alertCtrl: AlertController,
              ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.getTest();


  }



  async seleccionarTest() {


    if (this.mostrarTest) {
      if (this.isMantoux !== undefined && !this.isMantoux) {

        if (this.testEnviadoCorrectamente === false && this.numeroPreguntasSinResponder !== this.test.Preguntas.PreguntaInfo.length) {

          await this.comprobacionTest('Test Incompleto', '¿Seguro que desea cambiar de test?', 'Perderá todas sus respuestas');

        } else {

          await this.mostrarPopoverSeleccionarTest();

        }
      } else {

        await this.mostrarPopoverSeleccionarTest();

      }
    } else {

      await this.mostrarPopoverSeleccionarTest();

    }

  }

  async mostrarPopoverSeleccionarTest() {
    this.testEnviadoCorrectamente = false;
    const popover = await this.popoverController.create({
      component: ElegirTestPage,
      animated: true,
      showBackdrop: true,
      backdropDismiss: false
    });

    popover.onDidDismiss().then(() => {
      this.test = this.testServices.getTest();
      this.contador = 0;
      this.isMantoux = false;


      if (this.test.Preguntas !== undefined) {

        for (const pregunta of this.test.Preguntas.PreguntaInfo) {

          for (const respuesta of pregunta.Respuestas.RespuestaInfo) {

            respuesta.ValorCheck = false;
            if (this.isSubRespuesta(respuesta.SubRespuestas)) {
              if ( Array.isArray(respuesta.SubRespuestas['SubRespuestaInfo'].RespuestaSubPreguntas.RespuestaSubPreguntaInfo)) {
                for ( const subrespuesta of respuesta.SubRespuestas['SubRespuestaInfo'].RespuestaSubPreguntas.RespuestaSubPreguntaInfo) {

                  subrespuesta.ValorCheck = false;

                }
              }

            }
          }
        }

        console.log('TEST ELEGIDO: ', this.test , 'NUMERO PREGUNTAS: ', this.test.Preguntas.PreguntaInfo.length);
        this.numeroPreguntas = this.test.Preguntas.PreguntaInfo.length;

        this.respuestasTest = {

          NombreTest: this.test.Nombre,
          Permiso: this.test.Permiso,
          Password: this.usuario.Password,
          Usuario: this.usuario.Usuario,
          Respuestas: [],
          FechaRealizacion: ''

        };
        this.numeroPreguntasSinResponder = (this.test.Preguntas.PreguntaInfo.length - this.respuestasTest.Respuestas.length);

      } else {

        this.respuestasTest = {

          NombreTest: this.test.Nombre,
          Permiso: this.test.Permiso,
          Password: this.usuario.Password,
          Usuario: this.usuario.Usuario,
          Respuestas: [],
          FechaRealizacion: '',
          ImagenesMantoux: []

        };

        this.isMantoux = true;

      }


      this.mostrarTest = true;
      this.isFinTest = false;


    });

    return await popover.present();

  }

  getTest() {
     try {

       this.usuarioService.present('Cargando datos...');
       const xmlhttp = new XMLHttpRequest();
       xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
       xmlhttp.setRequestHeader('Content-Type', 'text/xml');
/*        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
 */       xmlhttp.responseType = 'document';
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
              '<ObtenerTests xmlns="http://tempuri.org/" />' +
           '</soap:Body>' +
         '</soap:Envelope>';

         xmlhttp.send(sr);


      xmlhttp.onreadystatechange =  async () => {
         if (xmlhttp.readyState === 4) {
             if (xmlhttp.status === 500) {
               this.usuarioService.dismiss();
             } else if (xmlhttp.status === 200) {
                 const xml = xmlhttp.responseXML;
                 const obj: RespuestaAPITest = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                 // tslint:disable-next-line: max-line-length
                 const a: TestInfo[] = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerTestsResponse']['ObtenerTestsResult']['TestInfo']));
                 const arrayTest: TestInfo[] = [];

                 if (a !== undefined && !Array.isArray(a)) {
                   const tes: TestInfo = a;
                   if ( tes.HacerTest.toString() === 'true') {

                    tes.HacerTest = false;

                  } else {

                    tes.HacerTest = true;

                  }

                  arrayTest.push(tes);

                } else {
                  for ( const tes of a ) {
                    if ( tes.HacerTest.toString() === 'true') {

                      tes.HacerTest = false;

                    } else {

                      tes.HacerTest = true;

                    }

                    arrayTest.push(tes);

                  }
/*                   arrayTest = a;
 */
                }
                this.testServices.guardarArrayTest(arrayTest);

                await this.seleccionarTest();
                this.usuarioService.dismiss();
              } else {
                this.usuarioService.dismiss();
                console.log('200 ' + xmlhttp.response);
              }
            } else {
              this.usuarioService.dismiss();
              console.log('4 ' + xmlhttp.status);
            }
        };
      } catch (error) {
        console.log('error ', error);
        this.usuarioService.dismiss();
      }
  }

  async guardarRespuesta(idPregunta: string, valorRespuesta: string, subRespuesta: SubRespuestaInfo, id: number, imagen?: string) {
      const respuestaMarcada = this.test.Preguntas.PreguntaInfo[this.contador].Respuestas.RespuestaInfo[id];
      for (const respuesta of this.test.Preguntas.PreguntaInfo[this.contador].Respuestas.RespuestaInfo ) {

        if (respuesta !== respuestaMarcada && respuesta.ValorCheck === true) {

          respuesta.ValorCheck = false;

        }

      }

      if (respuestaMarcada === this.test.Preguntas.PreguntaInfo[this.contador].Respuestas.RespuestaInfo[id]) {

        this.test.Preguntas.PreguntaInfo[this.contador].Respuestas.RespuestaInfo[id].ValorCheck = true;

      }

      if (this.isSubRespuesta(subRespuesta) && Array.isArray(subRespuesta['SubRespuestaInfo'].RespuestaSubPreguntas.RespuestaSubPreguntaInfo)) {


        await this.lanzarSubrespuestas(idPregunta, valorRespuesta, subRespuesta, id);


      } else {

        this.addRespuesta(idPregunta, valorRespuesta);
        const aux = this.contador + 1;
        this.numeroPreguntasSinResponder = (this.test.Preguntas.PreguntaInfo.length - this.respuestasTest.Respuestas.length);
          console.log('this.numeroPreguntasSinResponder ', this.numeroPreguntasSinResponder);
        if ( aux === this.numeroPreguntas) {
          this.mostrarBtnFin = true;
        }
        if (aux < this.numeroPreguntas && this.contador < this.numeroPreguntas && !this.mostrarBtnFin) {

          this.usuarioService.present('Cargando siguiente pregunta...');
          setTimeout(() => {
            this.usuarioService.dismiss();
            this.contador++;
          }, 1000);
        }

      }

  }

  async guardarRespuestaMantoux() {

      const foto: ImagenTestMantoux = {
        numeroPregunta: this.contador,
        foto: this.imagenAdjuntada,
        fechaFoto: moment().locale('es').format('YYYY-MM-DD')
      };
      console.log('GUARDAR this.contador', this.contador);
      console.log('fotoooo: ', foto)
      this.imagenesRespuesta[this.contador] = foto;
      console.log('GUARDAR FOTO, ARRAY:', this.imagenesRespuesta);

  }

  isSubRespuesta( obj: any) {

    return typeof obj === 'object' ? true : false;

  }

  async lanzarSubrespuestas(idPregunta: string,  valorRespuesta: string, subRespuestas: SubRespuestaInfo, id: number) {
    const modal = await this.modalCtrl.create({
      component: SubrespuestaModalPage,
      componentProps: {
        'arraySubRespuestas': JSON.stringify(subRespuestas)
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();



    await modal.onDidDismiss().then(() => {
      if ( data !== undefined ) {
        const datos: string[] = data;

        for (const resp of this.test.Preguntas.PreguntaInfo[this.contador].Respuestas.RespuestaInfo ) {

          if ( resp.SubRespuestas === subRespuestas) {
            if (Array.isArray(datos['arrayRespuestas'])) {

              for (const dat of datos['arrayRespuestas']) {
              resp.SubRespuestas['SubRespuestaInfo'].RespuestaSubPreguntas.RespuestaSubPreguntaInfo.map((subAux) => {

                  if (subAux.IdRespuesta === dat) {

                    subAux.ValorCheck = true;

                  }
                });
              }
            } else {
              resp.SubRespuestas['SubRespuestaInfo'].RespuestaSubPreguntas.RespuestaSubPreguntaInfo.map(subAux => {
                if (subAux.IdRespuesta === datos['arrayRespuestas'][0]) {


                  subAux.ValorCheck = true;

                }

              });


            }

          }

        }
        this.addRespuesta(idPregunta, valorRespuesta, data);


      } else {

        this.test.Preguntas.PreguntaInfo[this.contador].Respuestas.RespuestaInfo[id].ValorCheck = false;
      }

    });


  }

  addRespuesta(idPregunta: string, valorRespuesta: string, dat?: any) {

    if (dat !== undefined && dat !== null) {

      const datos: string[] = dat;
      const auxRespuesta: RespuestaTest = {

        IdPregunta: idPregunta.toString(),
        ValorRespuesta: valorRespuesta,
        SubRespuesta: datos
      };
      const index = this.respuestasTest.Respuestas.findIndex(resp => resp.IdPregunta === idPregunta);
      console.log(this.respuestasTest.Respuestas.findIndex(resp => resp.IdPregunta === idPregunta));
      if ( index === -1 ) {

        this.respuestasTest.Respuestas.push(auxRespuesta);

      } else {

        this.respuestasTest.Respuestas.splice(index, 1, auxRespuesta);


      }


    } else {


      const auxRespuesta: RespuestaTest = {

        IdPregunta: idPregunta,
        ValorRespuesta: valorRespuesta,

      };

      const index = this.respuestasTest.Respuestas.findIndex(resp => resp.IdPregunta === idPregunta);
      console.log(this.respuestasTest.Respuestas.findIndex(resp => resp.IdPregunta === idPregunta));
      if ( index === -1 ) {

        this.respuestasTest.Respuestas.push(auxRespuesta);

      } else {

        this.respuestasTest.Respuestas.splice(index, 1, auxRespuesta);


      }

    }


    this.numeroPreguntasSinResponder = (this.test.Preguntas.PreguntaInfo.length - this.respuestasTest.Respuestas.length);

    console.log('Array Respuestas: ', this.respuestasTest);
  }

  preguntaAnterior() {
    this.mostrarBtnFin = false;
    this.isImagenAdjuntada = true;
    this.contador = this.contador - 1;
  }

  preguntaSiguiente() {
    this.contador = this.contador + 1;
    if ( this.contador === this.numeroPreguntas) {
      if (this.respuestasTest.Respuestas.length === this.test.Preguntas.PreguntaInfo.length) {
        this.mostrarBtnFin = true;
      }
    }
  }

  preguntaSiguienteMantoux() {

      if (!this.isImagenAdjuntada) {

        this.usuarioService.presentAlert('Por favor', 'Inserte una imagen a la pregunta', 'Gracias');

      } else {
        if (this.imagenesRespuesta.length === 1 ) {
          console.log('Imagnes: ', this.imagenesRespuesta);
          this.isImagenAdjuntada = false;
        } else {

          this.isImagenAdjuntada = true;

        }
        this.contador = this.contador + 1;
        this.mostrarBtnFin = true;

      }
  }

  finalizarTest() {
    if (this.respuestasTest.Respuestas.length === this.test.Preguntas.PreguntaInfo.length) {
        this.finTest('Test terminado', '¿Desea enviarlo?', '');
      } else {
        this.usuarioService.presentAlert('ALERTA', 'Tiene ' + this.numeroPreguntasSinResponder + ' preguntas sin responder... Reviselo.', '');
      }

  }

  finalizarTestMantoux() {
    if (this.isImagenAdjuntada) {
        this.finTestMantoux('Test terminado', '¿Desea enviarlo?', '');
    } else {
        this.usuarioService.presentAlert('Por favor', 'Inserter la segunda imagen.' , 'Gracias');
    }
  }

  async finTest(titulo: string, subtitulo: string, mensaje: string) {
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
            this.contador--;
            this.isFinTest = false;
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.isFinTest = true;
            this.enviarRespuestas();
          }
        }
      ]
    });

    await alert.present();
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
            this.contador--;
            this.isFinTest = false;
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.isFinTest = true;
            this.enviarRespuestasMantoux();
          }
        }
      ]
    });

    await alert.present();
  }

  async comprobacionTest(titulo: string, subtitulo: string, mensaje: string) {
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
            console.log('Seleccion Test Cancelada');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.mostrarPopoverSeleccionarTest();
          }
        }
      ]
    });

    await alert.present();
  }

  enviarRespuestas() {
    console.log('Enviar Respuesta');
    this.respuestasTest.FechaRealizacion = moment().locale('es').format('YYYY-MM-DDT00:00:00');

    let auxResp = '';
    for (const resp of this.respuestasTest.Respuestas) {
      let aux = '';

      if  ( resp.SubRespuesta !== undefined && resp.SubRespuesta !== null) {
        let auxSubRespuesta = '';

        if (Array.isArray(resp.SubRespuesta['arrayRespuestas'])) {
          for ( const sub of resp.SubRespuesta['arrayRespuestas'] ) {

            let auxString = '';
            auxString = '<string>' + sub + '</string>';
            auxSubRespuesta = auxSubRespuesta.concat(auxString);

          }

        } else {

          auxSubRespuesta = '<string>' + resp.SubRespuesta['arrayRespuestas'] + '</string>';

        }
        aux = auxSubRespuesta;
      }
      if (aux === '') {

        aux = '<RespuestaTestSTInfo>' +
                '<IdPregunta>' + resp.IdPregunta + '</IdPregunta>' +
                '<Respuesta>' + resp.ValorRespuesta + '</Respuesta>' +
              '</RespuestaTestSTInfo>';
      } else {

        aux = '<RespuestaTestSTInfo>' +
                '<IdPregunta>' + resp.IdPregunta + '</IdPregunta>' +
                '<Respuesta>' + resp.ValorRespuesta + '</Respuesta>' +
                '<SubRespuestas>' +
                  aux +
                '</SubRespuestas>' +
              '</RespuestaTestSTInfo>';


      }

      auxResp = auxResp.concat(aux);

    }

    try {
      let Envio = false;
      console.log('TRY');
      this.usuarioService.present('Enviando Test...');
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
      xmlhttp.setRequestHeader('Content-Type', 'text/xml');
/*       xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
 */      xmlhttp.responseType = 'document';
        // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
      const sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap:Header>' +
            '<AuthHeader xmlns="http://tempuri.org/">' +
              '<Usuario>' + this.respuestasTest.Usuario + '</Usuario>' +
              '<Password>' + this.respuestasTest.Password + '</Password>' +
            '</AuthHeader>' +
          '</soap:Header>' +
          '<soap:Body>' +
            '<InsertarTest xmlns="http://tempuri.org/">' +
              '<TestRespuestas>' +
                '<TestResultInfo>' +
                  '<Nombre>' + this.respuestasTest.NombreTest + '</Nombre>' +
                  '<Permiso>' + this.respuestasTest.Permiso + '</Permiso>' +
                  '<FechaRealizacion>' + this.respuestasTest.FechaRealizacion + '</FechaRealizacion>' +
                  '<Respuestas>' +
                    auxResp +
                  '</Respuestas>' +
                '</TestResultInfo>' +
              '</TestRespuestas>' +
            '</InsertarTest>' +
          '</soap:Body>' +
        '</soap:Envelope>';

      console.log('STR PARA LA API: ', sr);


      xmlhttp.onreadystatechange = () => {
        console.log('FALLO 00');

        if (xmlhttp.readyState === 4 && !Envio) {
          Envio = true;
          if (xmlhttp.status === 200) {
              const xml = xmlhttp.responseXML;
              console.log('FALLO 0: ', xml);
              this.mostrarTest = false;
              this.usuarioService.dismiss();
              this.isFinTest = false;
              this.mostrarBtnFin = false;
              this.testEnviadoCorrectamente = true;
              this.usuarioService.presentAlert('Enhorabuena!!', 'Su test ha sido enviado con éxito !!', '');
              this.navCtrl.navigateRoot('/tab-inicio');
            } else {
              this.usuarioService.dismiss();
              console.log('FALLO 1');
              this.usuarioService.presentAlert('Fallo!!', 'Su test no ha podido ser enviado !!', 'Intentelo de nuevo más tarde');
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
      this.usuarioService.presentAlert('Fallo!!', 'Su test no ha podido ser enviado !!', 'Intentelo de nuevo más tarde');
    }

  }

  enviarRespuestasMantoux() {

    try {
      let Envio = false;
      console.log('TRY');
      this.usuarioService.present('Enviando Test...');
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
      xmlhttp.setRequestHeader('Content-Type', 'text/xml');
/*       xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
 */      xmlhttp.responseType = 'document';
        // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
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
                    '<FechaFoto>' + this.imagenesRespuesta[0].fechaFoto + '</FechaFoto>' +
                    '<Foto>' + this.imagenesRespuesta[0].foto  + '</Foto>' +
                  '</RespuestaTestMantouxInfo>' +
                  '<RespuestaTestMantouxInfo>' +
                  '<FechaFoto>' + this.imagenesRespuesta[1].fechaFoto + '</FechaFoto>' +
                  '<Foto>' + this.imagenesRespuesta[1].foto  + '</Foto>' +
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
              this.mostrarTest = false;
              this.usuarioService.dismiss();
              this.isFinTest = false;
              this.mostrarBtnFin = false;
              this.testEnviadoCorrectamente = true;
              this.usuarioService.presentAlert('Enhorabuena!!', 'Su test ha sido enviado con éxito !!', '');
              this.navCtrl.navigateRoot('/tab-inicio');
            } else {
              this.usuarioService.dismiss();
              console.log('Error 1');
              this.usuarioService.presentAlert('Fallo!!', 'Su test no ha podido ser enviado !!', 'Intentelo de nuevo más tarde');
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
      this.usuarioService.presentAlert('Fallo!!', 'Su test no ha podido ser enviado !!', 'Intentelo de nuevo más tarde');
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
      this.guardarRespuestaMantoux();

      this.isImagenAdjuntada = true;
    }).catch(error => {

      this.presentToast('Subida de imagen cancelada');
      console.log('ERROR', error);
      cancelado = true;

    });


  }

  async presentToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000
    });
    toast.present();
  }

  /* async presentTitulo(esImagen: boolean) {
    console.log('Present TItulo: ', esImagen);

    let optionsUpload: FileUploadOptions;
    const alert = await this.alertCtrl.create({
      header: 'Titulo',
      subHeader: 'Introduzca el titulo del archivo',
      inputs: [
        {
          name: 'txtTitulo',
          type: 'text',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async ( data ) => {
            this.usuarioService.present('Subiendo...');
            this.tituloArchivo = data.txtTitulo;
            if (esImagen) {

              optionsUpload = {
                fileName: this.tituloArchivo,
                chunkedMode: false,
                params: { title: this.tituloArchivo,
                          Extension: 'jpg',
                          }
                };
                console.log('Imagen URI: ', this.imageURI);
                console.log('Url API: ', this.imageURI);

              await this.fileTransfer.upload(this.imageURI, this.urlAPI, optionsUpload).then(resp => {
                  const respuestaAPI: RespuestaAPIDocumentos = JSON.parse(resp.response);
                  if (!respuestaAPI.error) {
                    this.presentToast('Imagen' + this.tituloArchivo + ' subida correctamente!');
                    this.usuarioService.dismiss();
                  } else {
                    this.usuarioService.dismiss();
                    this.usuarioService.presentAlert('Fallo al subir la imagen.', 'Intentelo de nuevo más tarde', '');
                  }
              }).catch(error => {

                this.usuarioService.dismiss();
                this.usuarioService.presentAlert('Fallo al mandar el archivo', 'Revise se conexión a internet.', '');
              });


            }
          }
        }
      ]
    });
    await alert.present();


  }
 */




}
