import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellpickerComponent } from './cellpicker.component';

describe('CellpickerComponent', () => {
  let component: CellpickerComponent;
  let fixture: ComponentFixture<CellpickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellpickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
