import { Injectable } from '@angular/core';
import { Certificado, Citas } from '../interfaces/interfaces-grupo-mpe';

@Injectable({
  providedIn: 'root'
})
export class CitasPendientesService {

  listaCitas = [];
  citasInfo: Citas;

  constructor() {  }

  setCitaPendiente(listaCitas) {
    this.listaCitas = listaCitas;
  }

  findAll() {
    return Promise.resolve(this.listaCitas);
  }

  getCertificados() {
    return this.listaCitas;
  }

  findById(id) {
    return Promise.resolve(this.listaCitas[id - 1]);
  }

  getItem(id) {
    for (let i = 0; i < this.listaCitas.length; i++) {
      if (this.listaCitas[i].id === parseInt(id, 10)) {
        return this.listaCitas[i];
      }
    }
    return null;
  }

  findByName(searchKey: string) {
    console.log(searchKey);
    const key: string = searchKey.toUpperCase();
    return Promise.resolve(this.listaCitas.filter((certificado: any) =>
        (certificado.Descripcion +  ' ' + certificado.FechaCita).toUpperCase().indexOf(key) > -1));
  }

  guardarCitaPendiente(cert: Citas){

    this.citasInfo = cert;

  }

  getCertificadoInfo(): Citas {

    return this.citasInfo

  }

}
