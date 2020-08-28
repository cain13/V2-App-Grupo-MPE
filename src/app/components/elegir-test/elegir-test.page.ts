import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { TestService } from '../../services/test.service';
import { TestInfo } from '../../interfaces/interfaces-grupo-mpe';
import { UsuarioLogin } from '../../interfaces/usuario-interfaces';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-elegir-test',
  templateUrl: './elegir-test.page.html',
  styleUrls: ['./elegir-test.page.scss'],
})
export class ElegirTestPage implements OnInit {

  arrayTest: TestInfo[] = [];
  usuario: UsuarioLogin;

/*   public radiusmiles = 1;
  public minmaxprice = {
    upper: 5000000,
    lower: 100000
  }; */

  constructor(  private usuarioService: UsuarioService,
                private testService: TestService,
                private popoverCtrl: PopoverController
    ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    const aux = this.testService.getArrayTest();
    if ( this.usuario.EsBuzo.toString() === 'true' ) {

      this.arrayTest = aux;

    } else {

      for (const test of aux) {

        if (test.Permiso !== 'BUCEO') {

          this.arrayTest.push(test);

        }

      }

    }
    console.log(this.arrayTest);
  }


  elegirTest(test: TestInfo) {

    this.testService.guardarTest(test);
    this.closeModal();

  }

  closeModal() {
    this.popoverCtrl.dismiss();
  }


}
