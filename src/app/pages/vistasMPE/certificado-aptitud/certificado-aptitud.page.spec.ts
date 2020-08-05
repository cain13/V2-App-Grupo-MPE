import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CertificadoAptitudPage } from './certificado-aptitud.page';

describe('CertificadoAptitudPage', () => {
  let component: CertificadoAptitudPage;
  let fixture: ComponentFixture<CertificadoAptitudPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadoAptitudPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoAptitudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
