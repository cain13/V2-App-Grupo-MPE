import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MessageService } from '../../providers/message/message.service';
import { Validators } from '@angular/forms';
import { Notificaciones } from 'src/app/interfaces/usuario-interfaces';
import { DocumentosTrabajadoresService } from '../../services/documentos-trabajadores.service';
import * as moment from 'moment';
import { NotificacionesMensajes } from '../../interfaces/usuario-interfaces';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  messages: Array<any> = [];

  listaNotificaciones: Array<Notificaciones> = [];
  listaMensajes: Array<NotificacionesMensajes> = [];
  constructor(
    public messageService: MessageService,
    public popoverController: PopoverController,
    private documentosService: DocumentosTrabajadoresService
  ) {
    this.getNotificaciones();
  }
  getNotificaciones(){
    this.listaMensajes = this.getNotificacionesSinLeer();
  }
  getNotificacionesSinLeer() {
    if(this.documentosService.getDocumentosSinLeer() > 0){
      const NotificacionesMensajes = 
      {
        Icono: "document-outline",
        Ruta: "certificado-aptitud",
        Mensaje: "(" + this.documentosService.getDocumentosSinLeer() +") documentos sin leer",
        Fecha:  moment().format('YYYY-MM-DDT00:00:00'),
        Id: 1
      };
      this.listaMensajes.push(NotificacionesMensajes);
      return this.listaMensajes;
    }else{
      const NotificacionesMensajes = 
      {
        Icono: "notifications-outline",
        Ruta: "/",
        Mensaje: "No hay notificaciones nuevas",
        Fecha:  moment().format('YYYY-MM-DDT00:00:00'),
        Id: 1
      };
      this.listaMensajes.push(NotificacionesMensajes);
      return this.listaMensajes;
    }
  }


  getMessages() {
    this.messages = this.messageService.getMessages();
  }

  close() {
    this.popoverController.dismiss();
  }

  
}
