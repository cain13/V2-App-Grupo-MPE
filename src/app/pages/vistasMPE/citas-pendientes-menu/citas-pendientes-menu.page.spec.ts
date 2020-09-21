import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CitasPendientesMenuPage } from './citas-pendientes-menu.page';

describe('CitasPendientesMenuPage', () => {
  let component: CitasPendientesMenuPage;
  let fixture: ComponentFixture<CitasPendientesMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitasPendientesMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CitasPendientesMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
