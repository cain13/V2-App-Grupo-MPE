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
  EsGuardiaCivil = false;

  Nombre = '';
  Email = '';
  Movil = '';
  Asunto = '';
  Descripcion = '';


  constructor(    private formBuilder: FormBuilder,
                  private usuarioService: UsuarioService,

    ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();

    if(this.usuario.Tipo.toString() !== 'CONSULTOR') {
      if (this.usuario.EsGuardiaCivil.toString() === 'true') {

        this.EsGuardiaCivil = true;

      }
      if (this.usuario.Usuario !== undefined && this.usuario.Usuario !== null) {

        this.Nombre = this.usuario.Nombre;
  
      } else {
  
        this.Nombre = '';
  
      }
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
        nombre: [this.Nombre, Validators.compose([
          Validators.required
        ])],
        movil: [this.Movil, Validators.compose([
          Validators.required
        ])],
        email: [this.Email, Validators.compose([
          Validators.required
        ])],
        asunto: [this.Asunto, Validators.compose([
          Validators.required
        ])],
        descripcion: [this.Descripcion, Validators.compose([
          Validators.required
        ])]
      });
   
    }
     }

  enviarConsulta() {
    console.log('NOMBRE: ', this.contactameForm.value.nombre);
    console.log('TELEFONO: ', this.contactameForm.value.telefono);
    console.log('EMAIL: ', this.contactameForm.value.email);
    console.log('ASUNTO: ', this.contactameForm.value.asunto);
    console.log('DESCRIPCION: ', this.contactameForm.value.descripcion)


  }

}