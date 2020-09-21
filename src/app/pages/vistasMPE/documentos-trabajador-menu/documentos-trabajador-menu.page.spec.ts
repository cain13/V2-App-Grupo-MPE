import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocumentosTrabajadorMenuPage } from './documentos-trabajador-menu.page';

describe('DocumentosTrabajadorMenuPage', () => {
  let component: DocumentosTrabajadorMenuPage;
  let fixture: ComponentFixture<DocumentosTrabajadorMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosTrabajadorMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentosTrabajadorMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
