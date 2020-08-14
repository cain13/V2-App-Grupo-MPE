import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ElegirTestPage } from './elegir-test.page';

describe('ElegirTestPage', () => {
  let component: ElegirTestPage;
  let fixture: ComponentFixture<ElegirTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElegirTestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ElegirTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
