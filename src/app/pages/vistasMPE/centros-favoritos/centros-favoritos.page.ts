import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, IonItemSliding } from '@ionic/angular';
import { DatabaseService } from '../../../services/database.service';
import { CentroAPI } from '../../../interfaces/centros-interfaces';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-centros-favoritos',
  templateUrl: './centros-favoritos.page.html',
  styleUrls: ['./centros-favoritos.page.scss'],
})
export class CentrosFavoritosPage implements OnInit {

  centrosFav: CentroAPI[];

  @ViewChild('slidingList') slidingList: IonItemSliding;

  constructor(
    public navCtrl: NavController,
    private db: DatabaseService,
    private usuarioService: UsuarioService
  ) {
  }

  async ngOnInit() {

    await this.usuarioService.present('Cargando centros...');
    await this.db.obtenerCentrosFavAll().then(res => {
      this.centrosFav = res;
      console.log('CentrosFAV de db: ', this.centrosFav);

    }).catch(error => {

      console.log('Error al cargar favoritos: ', error);

    });
    this.usuarioService.dismiss();


  }

  itemTapped(favorite) {
    this.navCtrl.navigateForward('property-detail/' + favorite.property.id);
  }

  async deleteItem(centro: CentroAPI) {
    this.usuarioService.borrarCentroFav(centro.IdCentroFav);
    const index = this.centrosFav.findIndex(cen => cen.Id === centro.Id);
    if (index > -1) {
      this.centrosFav.splice(index, 1);
    }
    await this.slidingList.close().then((a) => {
      console.log(a);
    });
  }

  async getFavorites() {
    await this.usuarioService.present('Cargando centros...');
    await this.db.obtenerCentrosFavAll().then(res => {
      this.centrosFav = res;

    }).catch(error => {

      console.log('Error al cargar favoritos: ', error);

    });
    this.usuarioService.dismiss();

  }

}
