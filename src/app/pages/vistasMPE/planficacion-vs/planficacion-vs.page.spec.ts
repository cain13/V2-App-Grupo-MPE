import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanficacionVSPage } from './planficacion-vs.page';

describe('PlanficacionVSPage', () => {
  let component: PlanficacionVSPage;
  let fixture: ComponentFixture<PlanficacionVSPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanficacionVSPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanficacionVSPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
