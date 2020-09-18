import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VigilanciaSaludPage } from './vigilancia-salud.page';

describe('VigilanciaSaludPage', () => {
  let component: VigilanciaSaludPage;
  let fixture: ComponentFixture<VigilanciaSaludPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VigilanciaSaludPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VigilanciaSaludPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
