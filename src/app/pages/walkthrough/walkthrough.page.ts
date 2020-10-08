import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, IonSlides, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})

export class WalkthroughPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  showSkip = true;
  slideOpts = {
    effect: 'flip',
    speed: 1000
  };
  dir: String = 'ltr';
  contadorVistas = 0;

  slideList: Array<any> = [
    {
      title: '¿Quienes  <strong><span class="text-danger">SOMOS</span></strong>?',
      description: 'GRUPO MPE nace en 1996 como Servicio de Prevención de Riesgos Laborales, cuyo objetivo es velar por la seguridad y salud de los trabajadores.',
      image: 'assets/img/house01.png',
    },
    {
      title: ' <strong>¿A que nos dedicamos?</strong>',
      description: 'MPE tiene su mayor actividad como servicio de prevención de riesgos laborales, así como formación a empresas y particulares en todas sus modalidades, consultoría sistemas de gestión de calidad y otros muchos productos enfocados a su empresa.',
      image: 'assets/img/business01.png',
    },
    {
      title: '<strong>Grupo MPE siempre a tu lado.</strong>',
      description: 'Ten acceso a toda la documentación e información que necesite de Grupo MPE.',
      image: 'assets/img/ionProperty-ico.png',
    }
  ];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public router: Router
  ) {
    this.menuCtrl.enable(false);
  }

  ionViewWillEnter() {
  }

  ngOnInit() {
  }

  onSlideNext() {
    this.contadorVistas++;
    if (this.contadorVistas === 3) {

      this.openLoginPage();

    }
    this.slides.slideNext(1000, false);
  }

  onSlidePrev() {
    this.contadorVistas--;
    this.slides.slidePrev(300);
  }

  // onLastSlide() {
  // 	this.slides.slideTo(3, 300)
  // }

  openHomeLocation() {
    this.navCtrl.navigateForward('/home-location');
    // this.router.navigateByUrl('/tabs/(home:home)');
  }

  openLoginPage() {
    this.navCtrl.navigateForward('/login');
  }

}