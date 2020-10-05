import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController, IonCheckbox, Platform, ModalController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { RespuestaAPIGetDatos, ObtenerDatosConsultorResult, RespuestaGetCentrosTrabajo, ObtenerCentros, MandarTokenAPI } from 'src/app/interfaces/interfaces-grupo-mpe';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { SeleccionarClientePage } from '../modal/seleccionar-cliente/seleccionar-cliente.page';
import { EmpresaConsultor } from '../../interfaces/usuario-interfaces';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { ModalCondicionesPage } from '../vistasMPE/modal-condiciones/modal-condiciones.page';




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
  @ViewChild('botonTerminos', {static: false}) botonTerminos: IonCheckbox;
  @ViewChild('botonMostarContra', {static: false}) botonMostarContra: IonCheckbox;

  checkFinger = false;
  checkRemember = true;
  checkTermino = true;
  usuario: UsuarioLogin;
  recordarme = true;
  terminos = true;
  loginFinger: boolean;
  tokenAPI: string;
  mostrarContra = false;
  passwordIcon = 'eye-outline';
  passwordIcon2 = 'eye-off-outline';
  plataforma: string;

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
    private usuarioService: UsuarioService,
    public modalCtrl: ModalController,
    private fcm: FCM,
    private platform: Platform

  ) {}


  ngOnInit() {

    this.fcm.getToken().then(token => {
      console.log('TOKEN: ', token);
      this.tokenAPI = token;
    });

    /* this.platform.ready().then(() => {

      if (this.platform.is('ios')) {

        this.plataforma = 'ios';

      } else if (this.platform.is('android')) {

        this.plataforma = 'android';

      }
    }); */
    console.log('PLATAFORMA: ', this.plataforma);
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
    this.usuarioService.setLogin(); 
    console.log('USUARIO: ', this.usuario);
    if (this.usuario !== undefined && this.usuario.FingerID.toString() === 'true') {
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
              this.navCtrl.navigateRoot('tab-inicio');

            } else if ( this.usuario.Tipo === 'CONSULTOR') {
              console.log('ACCEDEMOS COMO CONSULTOR');
              this.menuCtrl.enable(false, 'menuTrabajadores');
              this.menuCtrl.enable(true, 'menuCompleto');
              this.searchFilter();
            } else {
              if (this.usuario.EsGuardiaCivil) {

                console.log('ACCEDEMOS COMO GUARDIA CIVIL');
                this.menuCtrl.enable(false, 'menuTrabajadores');
                this.menuCtrl.enable(true, 'menuGuardiaCivil');
                this.menuCtrl.enable(false, 'menuCompleto');
                this.navCtrl.navigateRoot('tab-inicio');

              } else {

                console.log('ACCEDEMOS COMO TRABAJADOR');
                this.menuCtrl.enable(true, 'menuTrabajadores');
                this.menuCtrl.enable(false, 'menuGuardiaCivil');
                this.menuCtrl.enable(false, 'menuCompleto');
                this.navCtrl.navigateRoot('tab-inicio');

              }
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

  mostrarContrase() {
    console.log(this.passwordIcon2);
    this.mostrarContra = !this.mostrarContra;
    if (this.passwordIcon2 === 'eye-off-outline') {

      this.passwordIcon2 = 'eye-outline';
    } else {

      this.passwordIcon2 = 'eye-off-outline';

    }

  }

  Terminos() {
    window.open('https:mpeprevencion.com/terminos-condiciones.html', '_system');
  }


  async forgotPass() {

    window.open('https://grupompe.es/MpeNube/RecuperarPassApp.aspx', '_system');


    /* const alert = await this.alertCtrl.create({
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

    await alert.present(); */
  }

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  getDatosLogin() {
    try {
      this.usuarioService.present('Accediendo...');
      const xmlhttp = new XMLHttpRequest();
      this.checkTermino = this.botonTerminos.checked;
      if(!this.checkTermino){
        this.usuarioService.dismiss();
        this.presentAlert('Debe aceptar los terminos y condiciones', 'Advertencia');
        return;
      }

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
              '<Usuario>' + this.onLoginForm.value.usuario + '</Usuario>' +
              '<Password>' + this.onLoginForm.value.password + '</Password>' +
            '</AuthHeader>' +
          '</soap:Header>' +
          '<soap:Body>' +
            '<ObtenerDatosConsultor xmlns="http://tempuri.org/" />' +
          '</soap:Body>' +
        '</soap:Envelope>';
      console.log('USUARIO: ', this.onLoginForm.value.usuario);
      console.log('CONTRASEÑA: ', this.onLoginForm.value.password);
      console.log('MENSAJE MANDADO A LA API:', sr);
      xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    const xml = xmlhttp.responseXML;
                    const obj: RespuestaAPIGetDatos = JSON.parse(JSON.stringify(this.ngxXml2jsonService.xmlToJson(xml)));
                    // tslint:disable-next-line: max-line-length
                    const a: ObtenerDatosConsultorResult = JSON.parse(JSON.stringify(obj['soap:Envelope']['soap:Body']['ObtenerDatosConsultorResponse']['ObtenerDatosConsultorResult']));
                    console.log(a);
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
                      Recordarme:  this.checkRemember,
                      EsBuzo: a.EsBuzo,
                      EsGuardiaCivil: a.EsGuardiaCivil,
                      RequiereMantoux: a.RequiereMantoux,
                      Email: a.Email, 
                      Movil: a.Movil,
                      Telefono: a.Telefono
                    };

                    this.usuarioService.login(usuario);
                    this.usuarioService.guardarUsuario(usuario);
                    this.guardarTokenAPI(usuario.Tipo);
                    console.log('Tipo Empleado ' + usuario.Tipo);
                    
                    if ( usuario.Tipo === 'CLIENTE') {
                      console.log('ACCEDEMOS COMO CLIENTE');
                      this.menuCtrl.enable(false, 'menuTrabajadores');
                      this.menuCtrl.enable(true, 'menuCompleto');
                      this.getCentros();
                      this.navCtrl.navigateRoot('tab-inicio');

                    } else if ( usuario.Tipo === 'CONSULTOR') {
                      console.log('ACCEDEMOS COMO CONSULTOR');
                      this.menuCtrl.enable(false, 'menuTrabajadores');
                      this.menuCtrl.enable(true, 'menuCompleto');
                      this.searchFilter();
                    } else {
                      if (usuario.EsGuardiaCivil.toString() === 'true') {

                        console.log('ACCEDEMOS COMO GUARDIA CIVIL');
                        this.menuCtrl.enable(false, 'menuTrabajadores');
                        this.menuCtrl.enable(true, 'menuGuardiaCivil');
                        this.menuCtrl.enable(false, 'menuCompleto');
                        this.navCtrl.navigateRoot('tab-inicio');

                      } else {

                        console.log('ACCEDEMOS COMO TRABAJADOR');
                        this.menuCtrl.enable(true, 'menuTrabajadores');
                        this.menuCtrl.enable(false, 'menuGuardiaCivil');
                        this.menuCtrl.enable(false, 'menuCompleto');
                        this.navCtrl.navigateRoot('tab-inicio');

                      }
                    }
                } else if (xmlhttp.status === 500 ) {
                  this.presentAlert('Usuario o contraseña incorrectos', '');
                }
            }
            this.usuarioService.dismiss();
        };
      xmlhttp.send(sr);
    } catch (error) {
      this.usuarioService.dismiss();
    }
  }
  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SeleccionarClientePage
    });
    modal.onDidDismiss().then(() => {
      this.navCtrl.navigateRoot('tab-inicio');
    });
    return await modal.present();
  }

  getCentros() {
    const xmlhttp = new XMLHttpRequest();


    xmlhttp.open('POST', 'https://grupompe.es/MpeNube/ws/DocumentosWS.asmx', true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    console.log('HEADERS: ', xmlhttp.getResponseHeader);
    /*xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.setRequestHeader('Access-Control-Allow-Headers', '*');*/
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



  async guardarTokenAPI(tipoUsuario: string) {
    const tokenAPI: MandarTokenAPI = {

      Usuario: this.onLoginForm.value.usuario,
      Token: this.tokenAPI,
      TipoUsuario: tipoUsuario
    };
    console.log('GUARDAR TOKEN EN API: ', tokenAPI);


    await this.usuarioService.mandarTokenAPI(tokenAPI).then( resp => {
      console.log('Resp API token: ', resp);

      if (resp.Codigo === 200) {

        console.log('TOKEN del movil guardado en la API correctamente: ', resp);

      }

    }).catch(error => {

      console.log('ERROR al mandar TOKEN a API');

    });


  }

  async presentAlert(subtitulo: string, mensaje: string) {
    let error = 'Error'
    if(mensaje.length > 0){
      error = mensaje;
    }else{
      mensaje = 'Error'
    }
    const alert = await this.alertCtrl.create({
      header: mensaje,
      subHeader: subtitulo,
      message: '',
      buttons: ['OK']
    });

    await alert.present();
  }





}
