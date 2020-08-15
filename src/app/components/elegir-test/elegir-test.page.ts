import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { TestService } from '../../services/test.service';
import { TestInfo } from '../../interfaces/interfaces-grupo-mpe';

@Component({
  selector: 'app-elegir-test',
  templateUrl: './elegir-test.page.html',
  styleUrls: ['./elegir-test.page.scss'],
})
export class ElegirTestPage implements OnInit {

  arrayTest: TestInfo[];

/*   public radiusmiles = 1;
  public minmaxprice = {
    upper: 5000000,
    lower: 100000
  }; */

  constructor(  private modalCtrl: ModalController,
                private testService: TestService,
                private popoverCtrl: PopoverController
    ) { }

  ngOnInit() {

    this.arrayTest = this.testService.getArrayTest();
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
