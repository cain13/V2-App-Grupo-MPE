import { Injectable } from '@angular/core';
import { LoadingController, Platform  } from '@ionic/angular';
import { UsuarioLogin } from '../interfaces/usuario-interfaces';
import { DatabaseService } from './database.service';
import { Centro, Certificado } from '../interfaces/interfaces-grupo-mpe';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: UsuarioLogin;
  centros: Centro[];
  certificados: Certificado[];
  haFiltrado: boolean;
  desactivarSegundoPlano: boolean;



  isLoading = false;

  constructor(private loadingCtrl: LoadingController, 
    private dataBaseService: DatabaseService,
    private platform: Platform,
    private opener: FileOpener,
    private file: File,) { }


  login(usuario: UsuarioLogin) {

    this.dataBaseService.addUsuario(usuario);

  }

  guardarUsuario(usuario: UsuarioLogin) {

    this.usuario = usuario;

  }

  getUsuario(): UsuarioLogin {

    return this.usuario;

  }

  guardarCentros(centros: Centro[]) {
    console.log('usuario service: ', centros);
    this.centros = centros;

  }

  getCentros(): Centro[] {

    return this.centros;

  }

  guardarCertificados(array: Certificado[]) {
    this.certificados = [];
    this.haFiltrado = true;
    this.certificados = array;

  }

  getCertificados(): Certificado[] {

    return this.certificados;

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
  
  
  saveAndOpenPdf(pdf: string, filename: string) {
    console.log('path ' + this.file.dataDirectory);
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.dataDirectory;
    this.file.writeFile(writeDirectory, filename, this.convertBase64ToBlob(pdf, 'data:application/pdf;base64',512), {replace: true})
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
}
