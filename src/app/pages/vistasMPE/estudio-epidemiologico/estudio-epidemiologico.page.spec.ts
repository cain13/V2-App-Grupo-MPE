import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstudioEpidemiologicoPage } from './estudio-epidemiologico.page';

describe('EstudioEpidemiologicoPage', () => {
  let component: EstudioEpidemiologicoPage;
  let fixture: ComponentFixture<EstudioEpidemiologicoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudioEpidemiologicoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstudioEpidemiologicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
