import { Injectable } from '@angular/core';
import { LoadingController, Platform, ToastController, AlertController } from '@ionic/angular';
import { UsuarioLogin, CambiarPassword, EmpresaConsultor } from '../interfaces/usuario-interfaces';
import { DatabaseService } from './database.service';
import { Centro, Certificado, RecuentoNotificacionesResponse, Notificacion, Asistencia, Citas, Cliente } from '../interfaces/interfaces-grupo-mpe';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  version = 'Versión 1.0.1';
  usuario: UsuarioLogin;
  empresaConsultor: EmpresaConsultor;
  cambiarPassword: CambiarPassword;
  centros: Centro[];
  certificados: Certificado[];
  clientes: Cliente[];
  notificacion: Notificacion[];
  asistencia: Asistencia[];
  citas: Citas[];
  haFiltrado: boolean;
  haFiltradoHistorial: boolean;
  haFiltradoAsistencia: boolean;
  haFiltradoCitas: boolean;
  desactivarSegundoPlano: boolean;
  recuentoNotificaciones: number;


  isLoading = false;

  constructor(private loadingCtrl: LoadingController,
    private dataBaseService: DatabaseService,
    private platform: Platform,
    private opener: FileOpener,
    private file: File,
    private toastController: ToastController,
    private alertCtrl: AlertController) { }


  login(usuario: UsuarioLogin) {

    this.dataBaseService.addUsuario(usuario);

  }

  BorrarEmpleado() {
    this.dataBaseService.BorrarUsuario();
  }

  guardarUsuario(usuario: UsuarioLogin) {

    this.usuario = usuario;

  }

  getUsuario(): UsuarioLogin {

    return this.usuario;

  }

  guardarEmpresaConsultor(empresa: EmpresaConsultor) {
    this.empresaConsultor = null;
    this.empresaConsultor = empresa;

  }

  getEmpresaConsultor(): EmpresaConsultor {

    return this.empresaConsultor;

  }


  getCambiarPassword() {
    return this.cambiarPassword;
  }

  guardarCentros(centros: Centro[]) {
    console.log('usuario service: ', centros);
    this.centros = centros;

  }

  getCentros(): Centro[] {

    return this.centros;

  }

  getNotificaciones(): Notificacion[] {

    return this.notificacion;

  }


  guardarNotificaciones(array: Notificacion[]) {
    this.notificacion = [];
    this.haFiltradoHistorial = true;
    /* console.log('2.', this.getCertificados().length); */

    this.notificacion = array;

  }
  getHistorial(): Notificacion[] {

    return this.notificacion;

  }

  guardarCertificados(array: Certificado[]) {
    this.certificados = [];
    this.haFiltrado = true;
    /* console.log('2.', this.getCertificados().length); */

    this.certificados = array;

  }

  getCertificados(): Certificado[] {

    return this.certificados;

  }

  guardarClientes(array: Cliente[]) {
    this.clientes = [];

    this.clientes = array;

  }

  getClientes(): Cliente[] {

    return this.clientes;

  }

  guardarAsistencias(array: Asistencia[]) {
    this.asistencia = [];
    this.haFiltradoAsistencia = true;
    /* console.log('2.', this.getCertificados().length); */

    this.asistencia = array;

  }
  getAsistencia(): Asistencia[] {

    return this.asistencia;

  }

  guardarCitas(array: Citas[]) {
    this.asistencia = [];
    this.haFiltradoCitas = true;
    /* console.log('2.', this.getCertificados().length); */

    this.citas = array;

  }
  getCitas(): Citas[] {

    return this.citas;

  }



  async present(mensaje: string) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: mensaje
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      }).catch(error => {

        console.log('Ha tocado en la pantalla mienstras estaba el cargando... ', error);

      });
    });
  }

  async dismiss() {
    if (this.isLoading) {

      this.isLoading = false;
      return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));

    } else {

      return null;

    }

  }
  
  async presentAlert(titulo:string, subtitulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  
  saveAndOpenPdf(pdf: string, filename: string) {
    console.log('path ' + this.file.externalRootDirectory + '/Download/' + filename);
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalRootDirectory + '/Download/';
    this.file.writeFile(writeDirectory, filename, this.convertBase64ToBlob(pdf, 'data:application/pdf;base64', 512), {replace: true})
      .then(() => {
          this.opener.open(writeDirectory + filename, 'application/pdf')
              .catch(() => {
                  console.log('Error opening pdf file');
              });
      })
      .catch(() => {
          console.error('Error writing pdf file');
      });
  }

  convertBase64ToBlob(b64Data, contentType, sliceSize) {
    console.log(b64Data);
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {

            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
  }

  async presentToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000
    });
    toast.present();
  }
}
