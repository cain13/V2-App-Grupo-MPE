import { Component, OnInit } from '@angular/core';
import { Notificacion } from 'src/app/interfaces/usuario-interfaces';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mensaje-mantoux',
  templateUrl: './mensaje-mantoux.page.html',
  styleUrls: ['./mensaje-mantoux.page.scss'],
})
export class MensajeMantouxPage implements OnInit {

  notificacion: any;
  fecha: Date;
  mensaje: string;
  titulo: string;

  constructor(private notService: NotificacionesService, private navController: NavController) { }

  ngOnInit() {

    this.notificacion = this.notService.leerNotMantoux();
    console.log('thins.notificacions mantoux: ', this.notificacion);
    if (this.notificacion.toString().includes('title')) {

      console.log('MENSAJE MANTOUX: this.notificacion: ', this.notificacion);
      console.log('MENSAJE MANTOUX: TRIGGER: ', this.notificacion.trigger);
      console.log('MENSAJE MANTOUX: TRIGGER AT: ', this.notificacion.trigger.at);
      console.log('MENSAJE MANTOUX: TEXT: ', this.notificacion.text);
      console.log('MENSAJE MANTOUX: TITLE: ', this.notificacion.title);

      this.fecha = new Date(this.notificacion.trigger.at);
      this.titulo = this.notificacion.title;
      this.mensaje = this.notificacion.text;

    } else {

      this.fecha = this.notificacion.Fecha;
      this.titulo = this.notificacion.Titulo;
      this.mensaje = this.notificacion.Mensaje;

    }

  }


  irMantoux() {

    this.navController.navigateForward('/vista-tuberculina-inicio');

  }

}