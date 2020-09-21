import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Opciones, UsuarioLogin } from '../../../interfaces/usuario-interfaces';

@Component({
  selector: 'app-tab-inicio',
  templateUrl: './tab-inicio.page.html',
  styleUrls: ['./tab-inicio.page.scss'],
})
export class TabInicioPage implements OnInit {

  usuario: UsuarioLogin;

  opcionesTab: Opciones[];


  constructor(private usuarioService: UsuarioService) {

    this.usuario = this.usuarioService.getUsuario();

    
  }

  ngOnInit() {



  }

}
