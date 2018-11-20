import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectprofileComponent } from './projectprofile.component';

describe('ProjectprofileComponent', () => {
  let component: ProjectprofileComponent;
  let fixture: ComponentFixture<ProjectprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
