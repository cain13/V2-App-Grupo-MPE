import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverAvisarEditPerfilComponent } from './popover-avisar-edit-perfil.component';

describe('PopoverAvisarEditPerfilComponent', () => {
  let component: PopoverAvisarEditPerfilComponent;
  let fixture: ComponentFixture<PopoverAvisarEditPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAvisarEditPerfilComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverAvisarEditPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
