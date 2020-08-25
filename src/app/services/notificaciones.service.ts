import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable, Subject } from 'rxjs';
import { Notificacion } from '../interfaces/usuario-interfaces';

@Injectable({
  providedIn: 'root'
})


export class NotificacionesService {


  numNotificaciones$ = new Subject<number>();
  numNot: number;
  listaMensajes: Array<Notificacion> = [];


  constructor(private db: DatabaseService) { }

  aumentarNotificaciones(){
    this.db.obtenerTodasSinLeerNotificacion().then( resp => {
      this.numNot = resp.length;
      this.numNotificaciones$.next(this.numNot);
      console.log('aumentarNot: ', this.numNot);
      console.log(' resp.length: ',  resp.length);

    });

  }

  marcarNotificacionesLeidas(){
    this.numNot = 0;
    this.numNotificaciones$.next(this.numNot);
  }

  SumaUnaNotificaciones(){
      this.numNot = this.numNot + 1;;
      this.numNotificaciones$.next(this.numNot);
      console.log('aumentarNot: ', this.numNot);
  }

  getNotifiaciones$(): Observable<number>{

    return this.numNotificaciones$.asObservable();

  }

  async getNotificacion(id): Promise<Notificacion> {
    let notificacion:Notificacion;
    await this.db.obtenerNotificacion(id).then((noti) => {
      notificacion = noti;
    });
    return notificacion;
  }


}