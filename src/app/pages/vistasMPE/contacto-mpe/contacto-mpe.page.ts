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

  public contactameForm: FormGroup;
  usuario: UsuarioLogin;


  constructor(    private formBuilder: FormBuilder,
                  private usuarioService: UsuarioService,

    ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.contactameForm = this.formBuilder.group({
      nombre: [null, Validators.compose([
        Validators.required
      ])],
      telefono: [null, Validators.compose([
        Validators.required
      ])],
      email: [null, Validators.compose([
        Validators.required
      ])],
      asunto: [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  enviarConsulta() {
    console.log('NOMBRE: ', this.contactameForm.value.nombre);
    console.log('TELEFONO: ', this.contactameForm.value.telefono);
    console.log('EMAIL: ', this.contactameForm.value.email);
    console.log('ASUNTO: ', this.contactameForm.value.asunto);


  }

}