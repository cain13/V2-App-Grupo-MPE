import { Component, OnInit } from '@angular/core';
import { PopoverController, ViewWillEnter, ViewDidEnter, ModalController } from '@ionic/angular';
import { ElegirTestPage } from 'src/app/components/elegir-test/elegir-test.page';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';
import { UsuarioService } from '../../../services/usuario.service';
import { RespuestaAPITest, TestInfo } from 'src/app/interfaces/interfaces-grupo-mpe';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { TestService } from '../../../services/test.service';
import { SubrespuestaModalPage } from '../subrespuesta-modal/subrespuesta-modal.page';
import { SubRespuestaInfo } from '../../../interfaces/interfaces-grupo-mpe';

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

  constructor(private modalCtrl: ModalController,
              private usuarioService: UsuarioService,
              private ngxXml2jsonService: NgxXml2jsonService,
              private testServices: TestService,
              private popoverController: PopoverController
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
      this.mostrarTest = true;
      this.contador = 0;
      console.log('TESTSSSS: ', this.test);

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

  async guardarRespuesta(idPregunta: number, valorRespuesta: string, subRespuesta: SubRespuestaInfo) {

    console.log('Pregunta: ', idPregunta, 'Respuesta: ', valorRespuesta);
    if (this.isSubRespuesta(subRespuesta)) {

      await this.lanzarSubrespuestas(subRespuesta);

    } else {

      this.contador++;


    }
  }

  isSubRespuesta( obj: any) {

    return typeof obj === 'object' ? true : false;

  }

  async lanzarSubrespuestas(subRespuestas: SubRespuestaInfo) {
    console.log('PEPE: ');
    const modal = await this.modalCtrl.create({
      component: SubrespuestaModalPage,
      componentProps: {
        'arraySubRespuestas': JSON.stringify(subRespuestas)
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    console.log('DATOOOOS ', data);



/*     await modal.onDidDismiss().then(() => {

      this.contador++;
    }); */


  }



}
