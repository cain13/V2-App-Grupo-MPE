import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormacionPage } from './formacion.page';

describe('FormacionPage', () => {
  let component: FormacionPage;
  let fixture: ComponentFixture<FormacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
