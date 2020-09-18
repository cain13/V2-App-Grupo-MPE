import { Component, OnInit } from '@angular/core';
import { Opciones } from 'src/app/interfaces/usuario-interfaces';

@Component({
  selector: 'app-vigilancia-salud',
  templateUrl: './vigilancia-salud.page.html',
  styleUrls: ['./vigilancia-salud.page.scss'],
})
export class VigilanciaSaludPage implements OnInit {

  opciones: Opciones[];

  constructor() {

    this.opciones = [{
      Titulo: 'Certificado de Aptitud',
      Url: '/certificado-aptitud',
      Icon: 'document-outline'
    },
    {
      Titulo: 'Planificación VS',
      Url: '/planficacion-vs',
      Icon: 'calendar-outline'
    },
    {
      Titulo: 'Memoria Anual',
      Url: '/memoria-anual',
      Icon: 'folder-outline'
    },
    {
      Titulo: 'Estudio Epidemiológico',
      Url: '/estudio-epidemiologico',
      Icon: 'flask-outline'
    },
    {
      Titulo: 'Asistencia',
      Url: '/asistencia',
      Icon: 'help-buoy'
    }];

  }

  ngOnInit() {
  }

}
