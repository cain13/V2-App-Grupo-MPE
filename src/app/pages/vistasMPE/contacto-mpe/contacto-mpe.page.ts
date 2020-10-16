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

  public contactameForm: FormGroup;
  usuario: UsuarioLogin;


  constructor(    private formBuilder: FormBuilder,
                  private usuarioService: UsuarioService,

    ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();

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

      movil: [this.usuario.Movil, Validators.compose([
        Validators.required
      ])],
      email: [this.usuario.Email, Validators.compose([
        Validators.required
      ])],
      asunto: [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  enviarConsulta() {
    console.log('NOMBRE: ', this.usuario.Usuario);
    console.log('TELEFONO: ', this.contactameForm.value.telefono);
    console.log('EMAIL: ', this.contactameForm.value.email);
    console.log('ASUNTO: ', this.contactameForm.value.asunto);


  }

}
