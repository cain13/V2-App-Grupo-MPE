import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CitasPendientesPage } from './citas-pendientes.page';

describe('CitasPendientesPage', () => {
  let component: CitasPendientesPage;
  let fixture: ComponentFixture<CitasPendientesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitasPendientesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CitasPendientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
