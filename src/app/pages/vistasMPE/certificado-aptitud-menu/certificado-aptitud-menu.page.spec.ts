import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CertificadoAptitudMenuPage } from './certificado-aptitud-menu.page';

describe('CertificadoAptitudMenuPage', () => {
  let component: CertificadoAptitudMenuPage;
  let fixture: ComponentFixture<CertificadoAptitudMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadoAptitudMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoAptitudMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
