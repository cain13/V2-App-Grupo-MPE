import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VistaTubirculinaPage } from './vista-tubirculina.page';

describe('VistaTubirculinaPage', () => {
  let component: VistaTubirculinaPage;
  let fixture: ComponentFixture<VistaTubirculinaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistaTubirculinaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VistaTubirculinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
