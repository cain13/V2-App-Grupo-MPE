import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TestService } from '../../services/test.service';
import { TestInfo } from '../../interfaces/interfaces-grupo-mpe';
import { UsuarioLogin } from '../../interfaces/usuario-interfaces';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-popover-elegir-test-v2',
  templateUrl: './popover-elegir-test-v2.component.html',
  styleUrls: ['./popover-elegir-test-v2.component.scss'],
})
export class PopoverElegirTestV2Component implements OnInit {
  arrayTest: TestInfo[] = [];
  usuario: UsuarioLogin;
  aux: TestInfo[];

/*   public radiusmiles = 1;
  public minmaxprice = {
    upper: 5000000,
    lower: 100000
  }; */

  constructor(  private usuarioService: UsuarioService,
                private testService: TestService,
                private popoverCtrl: PopoverController
    ) {     this.aux = this.testService.getArrayTest();
    }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    console.log('TESTSSSSSS: ',this.aux);


    if ( this.usuario.EsBuzo.toString() === 'true' && this.usuario.RequiereMantoux.toString() === 'true') {

      this.arrayTest = this.aux;

    } else if (this.usuario.EsBuzo.toString() === 'true' && this.usuario.RequiereMantoux.toString() === 'false') {

      for (const test of this.aux) {

        if (test.Permiso !== 'MANTOUX') {

          this.arrayTest.push(test);

        }

      }

    } else if (this.usuario.EsBuzo.toString() === 'false' && this.usuario.RequiereMantoux.toString() === 'true') {

      for (const test of this.aux) {

        if (test.Permiso !== 'BUCEO') {

          this.arrayTest.push(test);

        }

      }

    } else {

      for (const test of this.aux) {

        if (test.Permiso !== 'BUCEO' && test.Permiso !== 'MANTOUX') {

          this.arrayTest.push(test);

        }

      }

    }
    console.log('TIPO DE DATO: ', typeof this.arrayTest[0].HacerTest);
    console.log('TIPO DE DATO 2: ', this.arrayTest[0].HacerTest.toString() === 'false');
    console.log('asdfasdfasdfasdfasdf:',this.arrayTest);
  }


  elegirTest(test: TestInfo) {

    this.testService.guardarTest(test);
    this.closeModal();

  }

  closeModal() {
    this.popoverCtrl.dismiss();
  }


}
