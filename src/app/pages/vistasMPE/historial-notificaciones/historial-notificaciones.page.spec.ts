import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistorialNotificacionesPage } from './historial-notificaciones.page';

describe('HistorialNotificacionesPage', () => {
  let component: HistorialNotificacionesPage;
  let fixture: ComponentFixture<HistorialNotificacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialNotificacionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialNotificacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
