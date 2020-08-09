import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController, IonCheckbox, Platform } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { RespuestaAPIGetDatos, ObtenerDatosConsultorResult, RespuestaGetCentrosTrabajo, ObtenerCentros } from 'src/app/interfaces/interfaces-grupo-mpe';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  soportaFingerID: boolean;
  @ViewChild('botonHuella', {static: false}) botonHuella: IonCheckbox;
  @ViewChild('botonRecordarme', {static: false}) botonRecordarme: IonCheckbox;
  checkFinger = false;
  checkRemember = true;
  usuario: UsuarioLogin;
  recordarme = true;
  loginFinger: boolean;





  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private translate: TranslateProvider,
    private formBuilder: FormBuilder,
    private ngxXml2jsonService: NgxXml2jsonService,
    private faio: FingerprintAIO,
    private usuarioService: UsuarioService

  ) { }


  ngOnInit() {

    this.usuario = this.usuarioService.getUsuario();

    if (this.usuario === null || this.usuario === undefined) {
      this.onLoginForm = this.formBuilder.group({
        usuario: [null, Validators.compose([
          Validators.required
        ])],
        password: [null, Validators.compose([
          Validators.required
        ])]
      });


    } else {
      if (this.usuario.Recordarme.toString() === 'true') {
        this.onLoginForm = this.formBuilder.group({
          usuario: [this.usuario.Usuario, Validators.compose([
            Validators.required
          ])],
          password: [this.usuario.Password, Validators.compose([
            Validators.required
          ])]
        });
      } else {
        this.onLoginForm = this.formBuilder.group({
          usuario: [null, Validators.compose([
            Validators.required
          ])],
          password: [null, Validators.compose([
            Validators.required
          ])]
        });
      }

      if (this.usuario.Recordarme.toString() === 'true' || this.usuario.Recordarme == null) {

        this.recordarme = true;

      } else {
        this.recordarme = false;
      }

      if (this.usuario.FingerID.toString() === 'true' || this.usuario.Recordarme == null) {

        this.loginFinger = true;

      } else {
        this.loginFinger = false;
      }


    }

  }

  async ionViewWillEnter() {
/*     this.usuarioService.desactivarSegundoPlano = true;
 */    this.menuCtrl.enable(false);

    if (this.usuario.FingerID.toString() === 'true') {
      await this.usuarioService.present('Accediendo...');

      await this.faio.isAvailable().then( async (result: any) => {
        this.soportaFingerID = true;
        console.log('LOGIN - Resultado SoportaFingerID: ', result);
        await this.faio.show({
          cancelButtonTitle: 'Cancel',
          disableBackup: true,
          title: 'Reconocimiento Dactilar',
        })
          .then((data: any) => {
            console.log('LOGIN - Resultado Reconocimiento Dactilar: ', data);
            if ( this.usuario.Tipo === 'CLIENTE') {
              console.log('ACCEDEMOS COMO CLIENTE');
              this.menuCtrl.enable(false, 'menuTrabajadores');
              this.menuCtrl.enable(true, 'menuCompleto');
              this.getCentros();
              this.usuarioService.dismiss();
              this.navCtrl.navigateRoot('certificado-aptitud');

            } else {
              console.log('ACCEDEMOS COMO TRABAJADOR');
              this.menuCtrl.enable(true, 'menuTrabajadores');
              this.menuCtrl.enable(false, 'menuCompleto');
              this.usuarioService.dismiss();
              this.navCtrl.navigateRoot('documentos-trabajador');

            }
          }).catch((error: any) => {
            this.usuarioService.dismiss();
            console.log('LOGIN: Fallo Show', error);
          });
        }).catch(() => {
          console.log('LOGIN: No soporta Finger');
          this.soportaFingerID = false;

        });
    }


  }



  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: this.translate.get('app.pages.login.label.forgot'),
      message: this.translate.get('app.pages.login.text.forgot'),
      inputs: [
        {
          name: 'usuario',
          type: 'text',
          placeholder: this.translate.get('app.label.email')
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                buttons: [
                  {
                    text: 'Close',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                  }
                ],
                message: this.translate.get('app.pages.login.text.sended'),
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  getDatosLogin() {
    this.usuarioService.present('Accediendo...');
    const xmlhttp = new XMLHttpRequest();
    const usuario = 'contavila@galicia.com';
    const pass = 'mp8496';

    xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.responseType = 'document';
      // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
    const sr =
      '<?xml version="1.0" encoding="utf-8"?>' +

      // tslint:disable-next-line: max-line-length
      '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +

        '<soap:Header>' +

          '<AuthHeader xmlns="http://tempuri.org/">' +

            '<Usuario>' + this.onLoginForm.value.usuario + '</Usuario>' +

            '<Password>' + this.onLoginForm.value.password + '</Password>' +

          '</AuthHeader>' +

        '</soap:Header>' +

        '<soap:Body>' +

          '<ObtenerDatosConsultor xmlns="http://tempuri.org/" />' +

        '</soap:Body>' +

      '</soap:Envelope>';

    xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                  const xml = xmlhttp.responseXML;
                  const obj: RespuestaAPIGetDatos = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                  // tslint:disable-next-line: max-line-length
                  const a: ObtenerDatosConsultorResult = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerDatosConsultorResponse']['ObtenerDatosConsultorResult']));

                  if (this.soportaFingerID) {
                    this.checkFinger = this.botonHuella.checked;
                  }
                  if (!this.soportaFingerID) {
                    this.checkRemember = this.botonRecordarme.checked;
                  }

                  // tslint:disable-next-line: no-shadowed-variable
                  const usuario: UsuarioLogin = {
                    Usuario: this.onLoginForm.value.usuario,
                    Password: this.onLoginForm.value.password,
                    FingerID: this.checkFinger,
                    Nombre: a.Nombre,
                    Tipo: a.Tipo,
                    Recordarme:  this.checkRemember
                  };

                  this.usuarioService.login(usuario);
                  this.usuarioService.guardarUsuario(usuario);

                  if ( usuario.Tipo === 'CLIENTE') {
                    console.log('ACCEDEMOS COMO CLIENTE');
                    this.menuCtrl.enable(false, 'menuTrabajadores');
                    this.menuCtrl.enable(true, 'menuCompleto');
                    this.getCentros();
                    this.navCtrl.navigateRoot('certificado-aptitud');

                  } else {
                    console.log('ACCEDEMOS COMO TRABAJADOR');
                    this.menuCtrl.enable(true, 'menuTrabajadores');
                    this.menuCtrl.enable(false, 'menuCompleto');
                    this.navCtrl.navigateRoot('documentos-trabajador');

                  }
              } else if (xmlhttp.status === 500 ) {
                this.presentAlert('Usuario o contraseña incorrectos', '');
              }
          }
          this.usuarioService.dismiss();
      };
    xmlhttp.send(sr);

  }

  getCentros() {
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
          '<Usuario>' + this.usuarioService.usuario.Usuario + '</Usuario>' +
          '<Password>' + this.usuarioService.usuario.Password + '</Password>' +
        '</AuthHeader>' +
      '</soap:Header>' +
      '<soap:Body>' +
        '<ObtenerCentrosTrabajo xmlns="http://tempuri.org/">' +
        '<NifClienteConsultor></NifClienteConsultor>' +
        '</ObtenerCentrosTrabajo>' +
      '</soap:Body>' +
    '</soap:Envelope>';

    xmlhttp.onreadystatechange =  () => {
          if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                const xml = xmlhttp.responseXML;
                const obj: RespuestaGetCentrosTrabajo = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                // tslint:disable-next-line: max-line-length
                const a: ObtenerCentros = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerCentrosTrabajoResponse']['ObtenerCentrosTrabajoResult']));
                console.log(a.CentroTrabajoInfo);
                this.usuarioService.guardarCentros(a.CentroTrabajoInfo);
              }
          }
      };

    xmlhttp.send(sr);
  }

  async presentAlert(subtitulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }





}
