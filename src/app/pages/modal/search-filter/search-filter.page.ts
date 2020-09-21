import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CentrosMPEFiltros, DatosFiltros, UsuarioLogin } from 'src/app/interfaces/usuario-interfaces';
import { MapasService } from 'src/app/services/mapas.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.page.html',
  styleUrls: ['./search-filter.page.scss'],
})
export class SearchFilterPage implements OnInit {


  usuario: UsuarioLogin;
  listaCentros = [];
  CodigoPostalFiltro: string;
  ProvinciaFiltro: string;
  LocalidadFiltro: string;


  constructor(private modalCtrl: ModalController,private usuarioService: UsuarioService,private mapasService: MapasService) { }

  ngOnInit() {
    this.listaCentros =  this.mapasService.getCentrosGuardados();
    this.usuario = this.usuarioService.getUsuario();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  filtrar() {
    const datosFil: CentrosMPEFiltros = {
      codigoPostal: this.CodigoPostalFiltro,
      provincia: this.ProvinciaFiltro,
      localidad: this.LocalidadFiltro,
    };

    this.mapasService.guardarFiltroCentros(datosFil);
    this.closeModal();

  }

}
