import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  listaAsistenciasTodos = [];
  constructor() { }

    setAsistencia(listadocumentos){
      this.listaAsistenciasTodos = listadocumentos;
    }

    findAll() {
      return Promise.resolve(this.listaAsistenciasTodos);
    }

    getAsistencias() {
      return this.listaAsistenciasTodos;
    }

    findById(id) {
      return Promise.resolve(this.listaAsistenciasTodos[id - 1]);
    }

    getItem(id) {
      for (let i = 0; i < this.listaAsistenciasTodos.length; i++) {
        if (this.listaAsistenciasTodos[i].id === parseInt(id)) {
          return this.listaAsistenciasTodos[i];
        }
      }
      return null;
    }

    findByName(searchKey: string) {
      console.log(searchKey);
      const key: string = searchKey.toUpperCase();
      return Promise.resolve(this.listaAsistenciasTodos.filter((documento: any) => 
          (documento.Trabajador +  ' ' + documento.NifTrabajador + ' ' + documento.FechaDocumento + ' ' + documento.NombreCentroMedico + ' ' + documento.SituacionReconocimientoMedico).toUpperCase().indexOf(key) > -1));
    }
}
