import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { UsuarioLogin } from '../interfaces/usuario-interfaces';

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

  addUsuario(usuario: UsuarioLogin) {

    // La siguiente sentencia SQL borra todo el contenido de la tabla:
    this.estadoBD().then(async () => {
      console.log('DB: Borramos todo el contenido de la tabla de BD...');
        this.storage.executeSql('DELETE FROM usuariosTable').then(() => {
          console.log('DB: Tabla USUARIOS vacia'); }).catch(error => { console.log('DB: ERROR AL BORRAR TABLAS USUARIO'); });

        // tslint:disable-next-line: max-line-length
        const data = [usuario.Usuario, usuario.Password, usuario.FingerID, usuario.Tipo, usuario.Nombre, usuario.Recordarme];
        // tslint:disable-next-line: max-line-length
        const respuesta = this.storage.executeSql('INSERT INTO usuariosTable (Usuario, Password_, FingerID, Tipo, Nombre, Recordarme) VALUES (?, ?, ?, ?, ?, ?)', data).then(() => {
          console.log('DB: Usuario añadido a la BD');

        });
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


}
