import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-contacto-mpe',
  templateUrl: './contacto-mpe.page.html',
  styleUrls: ['./contacto-mpe.page.scss'],
})
export class ContactoMpePage implements OnInit {

  Nombre = '';
  Email = '';
  Movil = '';
  DNI = '';
  EsGuardiaCivil = false;

  public contactameForm: FormGroup;
  usuario: UsuarioLogin;


  constructor(    private formBuilder: FormBuilder,
                  private usuarioService: UsuarioService,

    ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();

    if (this.usuario.Tipo.toString() !== 'CONSULTOR') {
      if (this.usuario.EsGuardiaCivil.toString() === 'true') {

        this.EsGuardiaCivil = true;

      }

      if (this.usuario.Usuario !== undefined && this.usuario.Usuario !== null) {

        this.Nombre = this.usuario.Nombre;

      } else {

        this.Nombre = '';

      }

      if (this.usuario.Email !== undefined && this.usuario.Email !== null && this.usuario.Email.length > 0) {
        this.Email = this.usuario.Email;
      } else {
        this.Email = '';
      }
      if (this.usuario.Movil !== undefined && this.usuario.Movil !== null && this.usuario.Movil.length > 0 && this.usuario.Movil.toString() !== '') {
        this.Movil = this.usuario.Movil;
      } else {
        this.Movil = '';
      }
      this.contactameForm = this.formBuilder.group({

        movil: [this.Movil, Validators.compose([
          Validators.required
        ])],
        email: [this.Email, Validators.compose([
          Validators.required
        ])],
        asunto: [null, Validators.compose([
          Validators.required
        ])],
        descripcion: [null, Validators.compose([
          Validators.required
        ])]
      });
    }

  }

  enviarConsulta() {
    console.log('NOMBRE: ', this.usuario.Usuario);
    console.log('EMAIL: ', this.contactameForm.value.email);
    console.log('ASUNTO: ', this.contactameForm.value.asunto);
    console.log('DESCRIPCION: ', this.contactameForm.value.descripcion);
    console.log('MOVIL: ', this.contactameForm.value.movil);

    this.usuarioService.present('Enviando consulta...');

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
            '<Password>' + this.usuario.Password + '</Password>' +
          '</AuthHeader>' +
        '</soap:Header>' +
        '<soap:Body>' +
          '<ContactarGrupoMpe xmlns="http://tempuri.org/">' +
            '<Datos>' +
              '<Nombre>' + this.usuario.Usuario + '</Nombre>' +
              '<Movil>' + this.contactameForm.value.movil + '</Movil>' +
              '<Email>' + this.contactameForm.value.email + '</Email>' +
              '<Asunto>' + this.contactameForm.value.asunto + '</Asunto>' +
              '<Descripcion>' + this.contactameForm.value.descripcion + '</Descripcion>' +
            '</Datos>' +
          '</ContactarGrupoMpe>' +
        '</soap:Body>' +
      '</soap:Envelope>';
    xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                if( !this.EsGuardiaCivil && this.usuario.Tipo !== 'CONSULTOR' && (this.contactameForm.value.movil !== this.Movil || this.contactameForm.value.email !== this.Email)) {
                  console.log('GUARDAMOS NUEVOS DATOS EN MPE');
                  this.guardarCambiosMPE();

                }
                this.usuarioService.dismiss();
                this.usuarioService.presentToast('Consulta enviada, nos pondremos en contacto en breve con usted.');
              } else {
                this.usuarioService.dismiss();
                this.usuarioService.presentToast('¡ERROR! Su consulta no ha podido ser mandada');
              }
          } else {
            this.usuarioService.dismiss();
            this.usuarioService.presentToast('¡ERROR! Su consulta no ha podido ser mandada.');
          }
      };
    xmlhttp.send(sr);
  }

  guardarCambiosMPE() {
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
                  '<Nombre>' + this.usuario.Nombre + '</Nombre>' +
                  '<Movil>' + this.contactameForm.value.movil + '</Movil>' +
                  '<Telefono>' + this.contactameForm.value.movil + '</Telefono>' +
                  '<Email>' + this.contactameForm.value.email + '</Email>' +
                '</Datos>' +
              '</InsertarDatosTrabajador>' +
            '</soap:Body>' +
          '</soap:Envelope>';


      console.log('MENSAJE MANDADO A LA API:', sr);
      xmlhttp.onreadystatechange = () => {
        console.log('XMLHTTP: ', xmlhttp);
            if (xmlhttp.readyState === 4) {

                const aux: UsuarioLogin = this.usuario;
                aux.Email = this.contactameForm.value.email;
                aux.Nombre = this.usuario.Nombre;
                aux.Telefono = this.contactameForm.value.movil;
                aux.Movil = this.contactameForm.value.movil;

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


}
