import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Platform, IonItemSliding } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { UsuarioLogin, Notificacion } from '../interfaces/usuario-interfaces';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);



  constructor(private platform: Platform, private sqlite: SQLite, private httpClient: HttpClient, private sqlPorter: SQLitePorter) {

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'Cronos.db',
        location: 'default'
      })
      .then(async (db: SQLiteObject) => {
          this.storage = db;
          console.log('DB: CREMAOS LAS TABLAS...');
          await this.crearTablas();
          console.log('DB: TABLAS CREADAS');
      });
    });
   }


   async crearTablas() {

    this.httpClient.get(
      'assets/dumps.sql',
      {responseType: 'text'}
    ).toPromise().then(data => {
      this.sqlPorter.importSqlToDb(this.storage, data).then( () => {
          this.isDbReady.next(true);
        }).catch(error => console.error(error));
    });
  }


  async estadoBD() {
    return new Promise((resolve, reject) => {

      if (this.isDbReady.getValue()) {

        resolve();

      } else {

        this.isDbReady.subscribe((ready) => {

          if (ready) {

            resolve();

          }

        });

      }

    });
  }

  async addUsuario(usuario: UsuarioLogin) {

    // La siguiente sentencia SQL borra todo el contenido de la tabla:
    this.estadoBD().then(async () => {
      console.log('DB: Borramos todo el contenido de la tabla de BD...');
        await this.storage.executeSql('DELETE FROM usuariosTable').then(() => {
          console.log('DB: Tabla USUARIOS vacia'); }).catch(error => { console.log('DB: ERROR AL BORRAR TABLAS USUARIO'); });

        // tslint:disable-next-line: max-line-length
        const data = [usuario.Usuario, usuario.Password, usuario.FingerID, usuario.Tipo, usuario.Nombre, usuario.Recordarme];
        // tslint:disable-next-line: max-line-length
        const respuesta = await this.storage.executeSql('INSERT INTO usuariosTable (Usuario, Password_, FingerID, Tipo, Nombre, Recordarme) VALUES (?, ?, ?, ?, ?, ?)', data).then(() => {
          console.log('DB: Usuario añadido a la BD');

        });
    });
  }



  BorrarUsuario() {
    // La siguiente sentencia SQL borra todo el contenido de la tabla:
    this.estadoBD().then(async () => {
      console.log('DB: Borramos todo el contenido de la tabla de BD...');
        this.storage.executeSql('DELETE FROM usuariosTable').then(() => {
          console.log('DB: Tabla USUARIOS vacia'); }).catch(error => { console.log('DB: ERROR AL BORRAR TABLAS USUARIO'); });
    });
  }

  async obtenerUltimoUsuario(): Promise<UsuarioLogin> {
    const res =  await this.storage.executeSql('SELECT * FROM usuariosTable LIMIT 1', []);
    if (res.rows.length !== 0) {
      return {
        Usuario: res.rows.item(0).Usuario,
        Password: res.rows.item(0).Password_,
        Tipo: res.rows.item(0).Tipo,
        Nombre: res.rows.item(0).Nombre,
        FingerID: res.rows.item(0).FingerID,
        Recordarme: res.rows.item(0).Recordarme
      };
    } else { return null; }

  }

  addNotificacion(notificacion: Notificacion) {

    this.estadoBD().then(async () => {
        const data = [notificacion.Titulo, notificacion.Mensaje, notificacion.Leido, notificacion.TipoDocumento, notificacion.Fecha,notificacion.Ruta,notificacion.Icono];
        const respuesta = await this.storage.executeSql('INSERT INTO notificacion (Titulo, Mensaje, Leido, TipoDocumento, Fecha,Ruta,Icono) VALUES (?, ?, ?, ?, ?, ?, ?)', data).then(() => {
          console.log('DB: Notificacion añadida');


        });
        console.log('DB: Respuesta Notificacion',respuesta);
    });
  }



  BorrarNotificacion(id) {
    // La siguiente sentencia SQL borra todo el contenido de la tabla:
    this.estadoBD().then(async () => {
      console.log('DB: Borramos notificacion BD...');
        this.storage.executeSql('DELETE FROM notificacion WHERE IdNotificacion='+id).then(() => {
          console.log('DB: Notificacion Borrada'); }).catch(error => { console.log('DB: ERROR AL BORRAR NOTIFICACION'); });
    });
  }


  async obtenerTodasNotificacion() {

    const sql = 'SELECT * FROM notificacion';

    try {
      const response = await this.storage.executeSql(sql, []);
      const notificaciones = [];
      console.log('obtener notificacion index ' + notificaciones);
      for (let index = 0; index < response.rows.length; index++) {
        notificaciones.push(response.rows.item(index));
        console.log('obtener notificacion index ' + response.rows.item(index));
      }
      return Promise.resolve<Notificacion[]>(notificaciones);
    } catch (error) {
      Promise.reject(error);
    }

  }

  async obtenerTodasSinLeerNotificacion() {

/*     const sql = 'SELECT * FROM notificacion WHERE Leido = ?';
 */
    try {
      const response = await this.storage.executeSql('SELECT * FROM notificacion WHERE Leido = ?', [0]);
      const notificaciones = [];
      for (let index = 0; index < response.rows.length; index++) {
        notificaciones.push(response.rows.item(index));
        console.log('obtener notificacion Leido2 ' + response.rows.item(index));
      }

      return Promise.resolve<Notificacion[]>(notificaciones);
    } catch (error) {
      Promise.reject(error);
    }

  }
  async marcarTodasNotificacionLeidas(): Promise<Notificacion> {
    const data = [1,0];
    // tslint:disable-next-line: max-line-length
    const res = await this.storage.executeSql('UPDATE notificacion SET Leido=? WHERE Leido = ?', data);
    return null;
  }
  async marcarNotificacionLeida(id) {
    const data = [1, id];
    // tslint:disable-next-line: max-line-length
    const res = await this.storage.executeSql('UPDATE notificacion SET Leido=? WHERE IdNotificacion = ?', data);

  }

  async obtenerNotificacion(id): Promise<Notificacion> {
    const res =  await this.storage.executeSql('SELECT * FROM notificacion WHERE IdNotificacion='+id, []);
    if (res.rows.length !== 0) {
      return {
        IdNotificacion: res.rows.item(0).IdNotificacion,
        Titulo: res.rows.item(0).Titulo,
        Mensaje: res.rows.item(0).Mensaje,
        TipoDocumento: res.rows.item(0).TipoDocumento,
        Leido: res.rows.item(0).Leido,
        Fecha: res.rows.item(0).Fecha,
        Ruta: res.rows.item(0).Ruta,
        Icono: res.rows.item(0).Icono,
      };
    } else { return null; }

  }

  async ModificarRutaNotificacion() {
    const res =  await this.storage.executeSql('SELECT * FROM notificacion ORDER BY IdNotificacion DESC LIMIT 1', []);
    if (res.rows.length !== 0) {
      const Notificacion = {
        IdNotificacion: res.rows.item(0).IdNotificacion,
        Titulo: res.rows.item(0).Titulo,
        Mensaje: res.rows.item(0).Mensaje,
        TipoDocumento: res.rows.item(0).TipoDocumento,
        Leido: res.rows.item(0).Leido,
        Fecha: res.rows.item(0).Fecha,
        Ruta: res.rows.item(0).Ruta,
        Icono: res.rows.item(0).Icono,
      };
      console.log("Notificacion.IdNotificacion " + Notificacion.IdNotificacion);
      const NuevaRuta = '/message/'+Notificacion.IdNotificacion;
      const data = [NuevaRuta, Notificacion.IdNotificacion];
    // tslint:disable-next-line: max-line-length
     const resultado = await this.storage.executeSql('UPDATE notificacion SET Ruta=? WHERE IdNotificacion = ?', data);
    } else { return null; }

  }


}
