import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Noticia, RespuestaAPINoticias } from 'src/app/interfaces/interfaces-grupo-mpe';
import { UsuarioLogin, EmpresaConsultor } from 'src/app/interfaces/usuario-interfaces';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotificacionesPage } from '../notificaciones/notificaciones.page';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(100px,0,0)` }), { optional: true }),
        query(':enter', stagger('150ms', [animate('250ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class InicioPage implements OnInit {

  usuario: UsuarioLogin;
  empresaCoonsultor: EmpresaConsultor;
  hayConsultor = false;
  Cantidad = 0;
  cantidad$: Observable<number>;
  isSmallPhone = false;
  header = new HttpHeaders().set('Content-Type', 'application/json');
  noticias: Noticia[];
  promociones: Noticia[];
  imagenDestacada: Noticia = {
    IdNoticia:9999,
    Descripcion:      "imagen destacada",
    Titulo:           "",
    Url:              "",
    PathImagen:       "https://mpecronos.com/Documentos/imagenesMPE/promo.png",
    DescripcionCorta: "",
    TipoNoticia:      "",
    TipoEmpleado:     "",
    FechaInicio:      "",
    FechaFin:         ""
  };

  constructor(  private usuarioService: UsuarioService,
                private notificacionesService: NotificacionesService,
                private platform: Platform,
                public menuCtrl: MenuController,
                public navCtrl: NavController,
                public modalCtrl: ModalController,
                private http: HttpClient
    ) {
    this.usuario = this.usuarioService.getUsuario();
  }

  async ngOnInit() {

    await this.usuarioService.present('Cargando datos...');

    await this.getNoticias().then( resp => {

      if (resp.Respuesta === 'OK') {
        console.log(resp);
        console.log('NOTICIAS resp: ', resp.Noticias);
        console.log('NOTICIAS resp : ', resp.Promocion);
        console.log('NOTICIAS: ', resp.Respuesta);
        if(resp.ImagenDestacada !== undefined){
          this.imagenDestacada = resp.ImagenDestacada;
        }
        this.noticias = resp.Noticias;
        this.promociones = resp.Promocion;
        console.log('NOTICIAS THIS: ', this.noticias);
        console.log('PROMOCIONES THIS : ', this.promociones);

      } else {

        this.usuarioService.presentAlert('ERROR', 'Fallo al cargar la información de inico', 'Intentelo de nuevo más tarde');
        console.log(resp);
      }
      this.usuarioService.dismiss();

    }).catch( error => {
      console.log(error);
      this.usuarioService.presentAlert('ERROR', 'Fallo al cargar la información de inico', 'Intentelo de nuevo más tarde');
      this.usuarioService.dismiss();


    });


  }

  ionViewWillEnter() {
    this.notificacionesService.aumentarNotificaciones();
    this.cantidad$ = this.notificacionesService.getNotifiaciones$();
    this.cantidad$.subscribe(num => this.Cantidad = num);
    console.log('Cantidad$ Notificacioens: ', this.Cantidad);
    this.menuCtrl.enable(true);

  }

  async notifications() {
    const modal = await this.modalCtrl.create({
      component: NotificacionesPage
        });
    return await modal.present();
  }

  async getNoticias(): Promise <RespuestaAPINoticias> {
    // tslint:disable-next-line: no-shadowed-variable
    const URL = 'https://mpecronos.com/api/apiMpe/GetNoticiasMpe';

    const usuario = {

      Empleado: this.usuario.Tipo

    };

    const respuesta = await  this.http.post<RespuestaAPINoticias>(URL, usuario, {headers: this.header}).toPromise();

    return respuesta;

  }

  masInfo(not: Noticia) {

    const navigationExtras: NavigationExtras = {
      queryParams: {
        noticia: JSON.stringify(not)
      }
    };

   this.navCtrl.navigateForward('/noticias-mas-info', navigationExtras);

  }

}
