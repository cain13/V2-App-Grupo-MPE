import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';

@Component({
  selector: 'app-modal-condiciones',
  templateUrl: './modal-condiciones.page.html',
  styleUrls: ['./modal-condiciones.page.scss'],
})
export class ModalCondicionesPage implements OnInit {
  usuario: UsuarioLogin;
  EsGuardiaCivil = false;
  constructor(public modalCtrl: ModalController,
              private usuarioService: UsuarioService,
              public navCtrl: NavController
    ) { }

  ngOnInit() {

    this.usuario = this.usuarioService.getUsuario();
    if(this.usuario.EsGuardiaCivil !== undefined && this.usuario.EsGuardiaCivil){
      this.EsGuardiaCivil = this.usuario.EsGuardiaCivil;
    }
  }

  aceptarTerminos() {
    try {
      const xmlhttp = new XMLHttpRequest();
      console.log('ACTUALIZAMOS DATOS BD 1... ');

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
              '<AceptarTerminos xmlns="http://tempuri.org/">' +
                '<Aceptado>' + true + '</Aceptado>' +
              '</AceptarTerminos>' +
            '</soap:Body>' +
          '</soap:Envelope>';

     xmlhttp.onreadystatechange = () => {

      console.log('XMLHTTP: ', xmlhttp);

            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    console.log('Guardado en la API correctamente');

                } else if (xmlhttp.status === 500 ) {
                  console.log('Error al guardar en la API');
                }
            }
        };
      xmlhttp.send(sr);
    } catch (error) {
      console.log('Error: ', error);
    }
    this.navCtrl.navigateRoot('tab-inicio');
    this.modalCtrl.dismiss();

  }

}
