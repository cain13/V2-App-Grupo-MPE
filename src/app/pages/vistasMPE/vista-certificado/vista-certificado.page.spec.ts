import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VistaCertificadoPage } from './vista-certificado.page';

describe('VistaCertificadoPage', () => {
  let component: VistaCertificadoPage;
  let fixture: ComponentFixture<VistaCertificadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistaCertificadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VistaCertificadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
