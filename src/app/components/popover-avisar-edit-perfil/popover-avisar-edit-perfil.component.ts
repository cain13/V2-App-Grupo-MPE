import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonCheckbox, NavController, PopoverController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioLogin } from '../../interfaces/usuario-interfaces';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-popover-avisar-edit-perfil',
  templateUrl: './popover-avisar-edit-perfil.component.html',
  styleUrls: ['./popover-avisar-edit-perfil.component.scss'],
})
export class PopoverAvisarEditPerfilComponent implements OnInit {

  valorCheck = false;
  @ViewChild('CheckRespuesta', {static: false}) botonCheck: IonCheckbox;
  usuario: UsuarioLogin;

  constructor(private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private popoverController: PopoverController) { }

  ngOnInit() {

    this.usuario = this.usuarioService.getUsuario();

  }

  async guardarCheck() {

    console.log('BotonCheck: ', this.botonCheck);

    const usuario: UsuarioLogin = {
      Usuario: this.usuario.Usuario,
      Password: this.usuario.Password,
      FingerID: this.usuario.FingerID,
      Nombre: this.usuario.Nombre,
      Tipo: this.usuario.Tipo,
      Recordarme:  this.usuario.Recordarme,
      EsBuzo: this.usuario.EsBuzo,
      EsGuardiaCivil: this.usuario.EsGuardiaCivil,
      RequiereMantoux: this.usuario.RequiereMantoux,
      Email: this.usuario.Email,
      Movil: this.usuario.Movil,
      Telefono: this.usuario.Telefono,
      RecordarEditarPerfil: this.botonCheck.checked,
      HacerMantoux: this.usuario.HacerMantoux,
      FechaMantoux: this.usuario.FechaMantoux
    };

    await this.usuarioService.login(usuario);

  }

  editarPerfil() {
    this.popoverController.dismiss();
    this.navCtrl.navigateForward('edit-profile');
  }

  cerrarPopover() {

    this.popoverController.dismiss();

  }

}
