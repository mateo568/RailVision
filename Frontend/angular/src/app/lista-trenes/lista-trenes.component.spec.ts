import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTrenesComponent } from './lista-trenes.component';

describe('ListaTrenesComponent', () => {
  let component: ListaTrenesComponent;
  let fixture: ComponentFixture<ListaTrenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTrenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTrenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
