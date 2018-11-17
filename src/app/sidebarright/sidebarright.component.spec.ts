import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarrightComponent } from './sidebarright.component';

describe('SidebarrightComponent', () => {
  let component: SidebarrightComponent;
  let fixture: ComponentFixture<SidebarrightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarrightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
