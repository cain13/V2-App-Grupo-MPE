import { Component, OnInit } from '@angular/core';
import { DatosMantoux, ObtenerResultadoTestMantouxResult, RespuestAPIMantoux, RespuestaTestMantouxInfo, VistaTimeLineDatos } from 'src/app/interfaces/interfaces-grupo-mpe';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';
import { NgxXml2jsonService } from 'ngx-xml2json';
import * as moment from 'moment';

@Component({
  selector: 'app-vista-tuberculina-inicio',
  templateUrl: './vista-tuberculina-inicio.page.html',
  styleUrls: ['./vista-tuberculina-inicio.page.scss'],
})
export class VistaTuberculinaInicioPage implements OnInit {


  datosMostrar: VistaTimeLineDatos;
  usuario: UsuarioLogin;
  datosMantoux: any[] = [];
  noHayDocumentos = false;


  constructor(private navCtrl: NavController,
              private usuarioService: UsuarioService,
              private ngxXml2jsonService: NgxXml2jsonService
              ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.getDatosMantoux();


  }



  getDatosMantoux() {
    this.usuarioService.present('Cargando datos...');
    try {
      const xmlhttp = new XMLHttpRequest();

      xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
      xmlhttp.setRequestHeader('content-type', 'text/xml');

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
            '<ObtenerResultadoTestMantoux  xmlns="http://tempuri.org/" />' +
          '</soap:Body>' +
        '</soap:Envelope>';

     xmlhttp.onreadystatechange = () => {

      console.log('XMLHTTP: ', xmlhttp);

            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    console.log('xml... ', xml);

                    const obj: RespuestAPIMantoux = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    console.log('obj: ', obj);
                    let a: ObtenerResultadoTestMantouxResult;
                    try {
                        a = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerResultadoTestMantouxResponse']['ObtenerResultadoTestMantouxResult']['ResultadoTestMantouxInfo']));

                    } catch (error) {
                      a = null;

                    }
                    console.log('a: ', a);

                    if (a !== null ) {
                      console.log('Array.isArray(a): ', Array.isArray(a));
                      if (!Array.isArray(a)) {
                        if (a.DatosMantoux.RespuestaTestMantouxInfo !== undefined && a.DatosMantoux.RespuestaTestMantouxInfo !== null && !Array.isArray(a.DatosMantoux.RespuestaTestMantouxInfo)) {
                          console.log('EL ARRAY DE OBJETOS TIENE SOLO 1 OBJETO...');
                          this.datosMantoux.push(a.DatosMantoux.RespuestaTestMantouxInfo);
                          console.log('this.datosMantoux[0].FechaInoculacion: ', this.datosMantoux[0].FechaInoculacion);
                          const fechaAux = moment(this.datosMantoux[0].FechaInoculacion);
                          if (fechaAux < moment('2000-01-01T00:00:00')) {
                            console.log('NO HACEMOS NADA YA NO SE HA INOCULADO AUN: 1900-01-01T00:00:00: ', fechaAux);
                            this.datosMantoux = null;
                            this.noHayDocumentos = true;
                          }
                          this.usuarioService.dismiss();


                        } else {

                          this.datosMantoux = a.DatosMantoux.RespuestaTestMantouxInfo;

                          this.usuarioService.dismiss();

                        }


                      } else {

                        for (const aux of a) {

                          if (!Array.isArray(aux.DatosMantoux.RespuestaTestMantouxInfo)) {
                            console.log('EL ARRAY DE OBJETOS TIENE SOLO 1 OBJETO...');
                            const fechaAux = moment(aux.DatosMantoux.RespuestaTestMantouxInfo.FechaInoculacion);
                            if (fechaAux < moment('2000-01-01T00:00:00')) {

                              console.log('NO HACEMOS NADA YA NO SE HA INOCULADO AUN: 1900-01-01T00:00:00: ', fechaAux);

                            } else {

                              this.datosMantoux.push(aux.DatosMantoux.RespuestaTestMantouxInfo);

                            }


                          } else {
                            for (const aux2 of aux.DatosMantoux.RespuestaTestMantouxInfo) {

                              this.datosMantoux.push(aux2);

                            }


                          }
                          this.usuarioService.dismiss();


                        }

                      }
                    } else if (a === null) {
                      this.datosMantoux = null;
                      this.noHayDocumentos = true;
                      console.log('a===null? ', a === null);
                      this.usuarioService.dismiss();

                    }
                } else if (xmlhttp.status === 500 ) {
                  this.usuarioService.presentAlert('', 'Error al cargar los datos del test', 'Intentelo de nuevo más tarde.');
                }
            }
        };

      xmlhttp.send(sr);
    } catch (error) {
      console.log('Error: ', error);
      this.usuarioService.dismiss();

    }
  }

  hacerPrueba() {

    this.navCtrl.navigateForward('vista-tubirculina');

  }

  isObject( obj: any) {
    const aux: RespuestaTestMantouxInfo = obj;

    if (typeof aux.FechaFoto === 'object' && aux.EsPositivo.toString() !== 'true' && aux.EsNegativo.toString() !== 'true') {

      return true;

    } else {

      return false;

    }
  }

  isResultPositivo(obj: any) {

    const aux: RespuestaTestMantouxInfo = obj;

    if (aux.EsPositivo.toString() === 'true') {

      return true;

    } else {

      return false;

    }

  }

  isPendiente(obj: any) {

    const aux: RespuestaTestMantouxInfo = obj;
    console.log('AUXXXX: ', aux);
    if (aux.EsPositivo.toString() === 'false' && aux.EsNegativo.toString() === 'false') {
      console.log('AUXXXX: ', true);

      return true;

    } else {
      console.log('AUXXXX: ', false);

      return false;

    }
  }
}