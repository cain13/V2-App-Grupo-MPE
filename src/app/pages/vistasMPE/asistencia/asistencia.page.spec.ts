import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsistenciaPage } from './asistencia.page';

describe('AsistenciaPage', () => {
  let component: AsistenciaPage;
  let fixture: ComponentFixture<AsistenciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
