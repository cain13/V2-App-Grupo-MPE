import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemoriaAnualPage } from './memoria-anual.page';

describe('MemoriaAnualPage', () => {
  let component: MemoriaAnualPage;
  let fixture: ComponentFixture<MemoriaAnualPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoriaAnualPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemoriaAnualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
