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

  slideList: Array<any> = [
    {
      title: '¿Quienes  <strong><span class="text-danger">SOMOS</span></strong>?',
      description: 'GRUPO MPE nace en 1996 como Servicio de Prevención de Riesgos Laborales, cuyo objetivo es velar por la seguridad y salud de los trabajadores.',
      image: 'assets/img/house01.png',
    },
    {
      title: ' <strong>¿Donde estamos?</strong>',
      description: 'Encuentra tu Centro MPE más cercano, para tu próximo reconociemnto medico o para cualquier necesidad.',
      image: 'assets/img/business01.png',
    },
    {
      title: '<strong>Su centro medico en la mano.</strong>',
      description: 'Ten acceso los resultados de sus reconocimientos y toda la información que necesite de Grupo MPE.',
      image: 'assets/img/rent01.png',
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
    this.slides.slideNext(1000, false);
  }

	onSlidePrev() {
    this.slides.slidePrev(300);
  }

  // onLastSlide() {
  // 	this.slides.slideTo(3, 300)
  // }

  openHomeLocation() {
    this.navCtrl.navigateRoot('/home-location');
    // this.router.navigateByUrl('/tabs/(home:home)');
  }

  openLoginPage() {
    this.navCtrl.navigateForward('/login');
  }

}