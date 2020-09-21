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
      Url: '/certificado-aptitud-menu',
      Icon: 'document-outline',
      direct: 'forward'
    },{
      Titulo: 'Citas Pendientes',
      Url: '/citas-pendientes-menu',
      direct: 'forward',
      Icon: 'timer-outline'
    },
    {
      Titulo: 'Planificación VS',
      Url: '/planficacion-vs',
      Icon: 'calendar-outline',
      direct: 'forward'
    },
    {
      Titulo: 'Memoria Anual',
      Url: '/memoria-anual',
      Icon: 'folder-outline',
      direct: 'forward'
    },
    {
      Titulo: 'Estudio Epidemiológico',
      Url: '/estudio-epidemiologico',
      Icon: 'flask-outline',
      direct: 'forward'
    },
    {
      Titulo: 'Asistencia',
      Url: '/asistencia',
      Icon: 'help-buoy',
      direct: 'forward'
    }];

  }

  ngOnInit() {
  }

}
