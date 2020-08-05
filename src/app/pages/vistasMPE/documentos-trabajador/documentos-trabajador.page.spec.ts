import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocumentosTrabajadorPage } from './documentos-trabajador.page';

describe('DocumentosTrabajadorPage', () => {
  let component: DocumentosTrabajadorPage;
  let fixture: ComponentFixture<DocumentosTrabajadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosTrabajadorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentosTrabajadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
