import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VistaTuberculinaInicioPage } from './vista-tuberculina-inicio.page';

describe('VistaTuberculinaInicioPage', () => {
  let component: VistaTuberculinaInicioPage;
  let fixture: ComponentFixture<VistaTuberculinaInicioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistaTuberculinaInicioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VistaTuberculinaInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
