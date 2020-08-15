import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocumentosCOVIDPage } from './documentos-covid.page';

describe('DocumentosCOVIDPage', () => {
  let component: DocumentosCOVIDPage;
  let fixture: ComponentFixture<DocumentosCOVIDPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosCOVIDPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentosCOVIDPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
