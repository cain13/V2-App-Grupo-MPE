import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestMenuPage } from './test-menu.page';

describe('TestMenuPage', () => {
  let component: TestMenuPage;
  let fixture: ComponentFixture<TestMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
