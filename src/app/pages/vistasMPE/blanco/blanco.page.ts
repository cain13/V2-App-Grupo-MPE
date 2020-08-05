import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { UsuarioService } from '../../../services/usuario.service';
import { NavController } from '@ionic/angular';
import { UsuarioLogin } from '../../../interfaces/usuario-interfaces';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-blanco',
  templateUrl: './blanco.page.html',
  styleUrls: ['./blanco.page.scss'],
})
export class BlancoPage implements OnInit {

  usuario: UsuarioLogin;

  constructor(private databaseService: DatabaseService,
              private usuarioService: UsuarioService,
              private navCtrl: NavController) { }

  async ngOnInit() {

    await this.usuarioService.dismiss();
    this.databaseService.estadoBD().then( async () => {

      console.log('BLANCO: Comprobamos si hay ultimo usuario...');
      await this.databaseService.obtenerUltimoUsuario().then( ultimoUsuario => {

        if (ultimoUsuario === null) {
          console.log('No hay usuarios en la BD');
          this.navCtrl.navigateRoot('/walkthrough');

        } else {

         this.usuario = {
            Usuario: ultimoUsuario.Usuario,
            Password: ultimoUsuario.Password,
            Tipo: ultimoUsuario.Tipo,
            Nombre: ultimoUsuario.Nombre,
            FingerID: ultimoUsuario.FingerID,
            Recordarme: ultimoUsuario.Recordarme
          };

         this.usuarioService.guardarUsuario(this.usuario);

         console.log('BLANCO: Si hay usuario en BD: ', this.usuario);

         this.navCtrl.navigateForward('/login');
        }
      });

      });

    }

  }

