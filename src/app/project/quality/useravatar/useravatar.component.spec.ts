import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseravatarComponent } from './useravatar.component';

describe('UseravatarComponent', () => {
  let component: UseravatarComponent;
  let fixture: ComponentFixture<UseravatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseravatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseravatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
