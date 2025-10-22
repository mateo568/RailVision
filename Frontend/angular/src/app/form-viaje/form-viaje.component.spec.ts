import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViajeComponent } from './form-viaje.component';

describe('FormViajeComponent', () => {
  let component: FormViajeComponent;
  let fixture: ComponentFixture<FormViajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
