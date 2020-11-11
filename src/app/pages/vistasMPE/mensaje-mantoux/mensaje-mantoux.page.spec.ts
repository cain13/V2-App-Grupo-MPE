import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MensajeMantouxPage } from './mensaje-mantoux.page';

describe('MensajeMantouxPage', () => {
  let component: MensajeMantouxPage;
  let fixture: ComponentFixture<MensajeMantouxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeMantouxPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MensajeMantouxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
