import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectbimComponent } from './projectbim.component';

describe('ProjectbimComponent', () => {
  let component: ProjectbimComponent;
  let fixture: ComponentFixture<ProjectbimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectbimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectbimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
