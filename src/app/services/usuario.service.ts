import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { UsuarioLogin } from '../interfaces/usuario-interfaces';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: UsuarioLogin;
  desactivarSegundoPlano: boolean;



  isLoading = false;

  constructor(private loadingCtrl: LoadingController, private dataBaseService: DatabaseService) { }


  login(usuario: UsuarioLogin) {

    this.dataBaseService.addUsuario(usuario);

  }

  guardarUsuario(usuario: UsuarioLogin) {

    this.usuario = usuario;

  }

  getUsuario(): UsuarioLogin {

    return this.usuario;

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
}
