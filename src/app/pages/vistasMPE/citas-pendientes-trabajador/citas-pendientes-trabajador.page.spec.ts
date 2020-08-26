import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CitasPendientesTrabajadorPage } from './citas-pendientes-trabajador.page';

describe('CitasPendientesTrabajadorPage', () => {
  let component: CitasPendientesTrabajadorPage;
  let fixture: ComponentFixture<CitasPendientesTrabajadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitasPendientesTrabajadorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CitasPendientesTrabajadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
