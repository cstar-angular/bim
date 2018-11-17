import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LodComponent } from './lod.component';

describe('LodComponent', () => {
  let component: LodComponent;
  let fixture: ComponentFixture<LodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
