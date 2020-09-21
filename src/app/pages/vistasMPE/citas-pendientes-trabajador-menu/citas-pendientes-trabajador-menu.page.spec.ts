import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CitasPendientesTrabajadorMenuPage } from './citas-pendientes-trabajador-menu.page';

describe('CitasPendientesTrabajadorMenuPage', () => {
  let component: CitasPendientesTrabajadorMenuPage;
  let fixture: ComponentFixture<CitasPendientesTrabajadorMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitasPendientesTrabajadorMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CitasPendientesTrabajadorMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
