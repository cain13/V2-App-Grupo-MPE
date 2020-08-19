import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { PopoverController, ModalController, IonCheckbox, IonRadio, AlertController } from '@ionic/angular';
import { ElegirTestPage } from 'src/app/components/elegir-test/elegir-test.page';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';
import { UsuarioService } from '../../../services/usuario.service';
import { RespuestaAPITest, TestInfo, RespuestaTest, RespuestasTestAPI } from 'src/app/interfaces/interfaces-grupo-mpe';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { TestService } from '../../../services/test.service';
import { SubrespuestaModalPage } from '../subrespuesta-modal/subrespuesta-modal.page';
import { SubRespuestaInfo, RespuestaSubPreguntas, RespuestaSubPreguntaInfo } from '../../../interfaces/interfaces-grupo-mpe';
import { isArray } from 'util';

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
  isFinTest = false;


  @ViewChildren('CheckRespuesta') botonRespuestas: QueryList<IonCheckbox>;


  constructor(private modalCtrl: ModalController,
              private usuarioService: UsuarioService,
              private ngxXml2jsonService: NgxXml2jsonService,
              private testServices: TestService,
              private popoverController: PopoverController,
              private alertController: AlertController
              ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.getTest();


  }


  async seleccionarTest() {

    const popover = await this.popoverController.create({
      component: ElegirTestPage,
      animated: true,
      showBackdrop: true,
      backdropDismiss: false
    });

    popover.onDidDismiss().then(() => {
      this.test = this.testServices.getTest();
      this.contador = 0;
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
        Respuestas: []

      };
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
       xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
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
                 let arrayTest: TestInfo[] = [];

                 if (a !== undefined && !Array.isArray(a)) {

                  arrayTest.push(a);

                } else {

                  arrayTest = a;

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

  async guardarRespuesta(idPregunta: string, valorRespuesta: string, subRespuesta: SubRespuestaInfo, id: number) {
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
      if ( aux === this.numeroPreguntas) {

        this.isFinTest = true;
        this.finTest('Test terminado', '¿Desea enviarlo?', '');

      }
      this.contador++;


    }



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

      const aux = parseInt(idPregunta, 10) - 1;
      this.respuestasTest.Respuestas.splice(aux, 1, auxRespuesta);


    } else {


      const auxRespuesta: RespuestaTest = {

        IdPregunta: idPregunta,
        ValorRespuesta: valorRespuesta,

      };

      const aux = parseInt(idPregunta, 10) - 1;
      this.respuestasTest.Respuestas.splice(aux, 1, auxRespuesta);

    }

    

    console.log('Array Respuestas: ', this.respuestasTest);
  }

  preguntaAnterior() {
    this.contador = this.contador - 1;

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
            this.enviarRespuestas();
          }
        }
      ]
    });

    await alert.present();
  }

  enviarRespuestas() {


    console.log('MANDAR TEST: ', this.respuestasTest);

  }



}
