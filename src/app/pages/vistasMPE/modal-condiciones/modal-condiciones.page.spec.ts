import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalCondicionesPage } from './modal-condiciones.page';

describe('ModalCondicionesPage', () => {
  let component: ModalCondicionesPage;
  let fixture: ComponentFixture<ModalCondicionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCondicionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCondicionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
