import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable, Subject } from 'rxjs';
import { Notificacion } from '../interfaces/usuario-interfaces';

@Injectable({
  providedIn: 'root'
})


export class NotificacionesService {


  private numNotificaciones$ = new Subject<number>();
  private numNot: number;
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

  getNotifiaciones$(): Observable<number>{

    return this.numNotificaciones$.asObservable();

  }


}
