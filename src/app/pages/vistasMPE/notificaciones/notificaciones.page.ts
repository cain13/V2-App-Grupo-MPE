import { Component, OnInit } from '@angular/core';
import { Notificaciones, Notificacion } from 'src/app/interfaces/usuario-interfaces';
import { MessageService } from 'src/app/providers';
import { NavController, ModalController } from '@ionic/angular';
import { DocumentosTrabajadoresService } from 'src/app/services/documentos-trabajadores.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DatabaseService } from 'src/app/services/database.service';
import { async } from 'rxjs/internal/scheduler/async';
import * as moment from 'moment';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  
  messages: Array<any> = [];

  listaNotificaciones: Array<Notificaciones> = [];
  listaMensajes: Array<Notificacion> = [];
  constructor(
    public messageService: MessageService,
    public modalCtrl: ModalController,
    private documentosService: DocumentosTrabajadoresService,
    private usuarioService: UsuarioService,
    private navController: NavController,
    private db: DatabaseService
  ) {}

  
  async ngOnInit() {
    await this.getNotificaciones();
  }
    async getNotificaciones(){
    this.usuarioService.present("Cargando notificaciones...");

    await this.db.obtenerTodasNotificacion().then( async res => {
      
      console.log('FICHAR: respuestaBD motivos: ', res);
      this.listaMensajes = res;
      if(res.length == 0){
        this.getSinNotificaciones();
      }
      this.usuarioService.dismiss();
    }).catch(() => {
      this.usuarioService.dismiss();
      console.log('FICHAR ERROR: Obtener Lista Motivos');
      this.getSinNotificaciones();
    });
    // AQUI CARGO LISTA NOTIFICACION DE BD
    // SI LA LISTA ES VACIA CREO NOTIFICACION DE NO HAY NOTIFICACIONES
  }

  getSinNotificaciones() {
  
      const Notificacion = 
      {
        IdNotificacion: 1,
        Titulo: "No tienes notificaciones",
        Icono: "notifications-off-outline",
        Ruta: "/",
        Mensaje: "No hay notificaciones nuevas",
        Fecha:  moment().format('YYYY-MM-DDT00:00:00'),
        Leido: true,
        TipoDocumento: "Docuemento"
      };
      this.listaMensajes.push(Notificacion);
      return this.listaMensajes;
  }


  getMessages() {
    this.messages = this.messageService.getMessages();
  }

  async close(idNotificacion: number, ruta: string) {
    //const rutaAux = ruta.concat(':')
    await this.db.marcarNotificacionLeida(idNotificacion).then(() => {

      this.navController.navigateForward(ruta);
      this.modalCtrl.dismiss();

    }).catch( error => {

      this.modalCtrl.dismiss();

    } );

  }

  closeModal() {

    this.modalCtrl.dismiss();

  }

  
}
