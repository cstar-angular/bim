import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectconfComponent } from './projectconf.component';

describe('ProjectconfComponent', () => {
  let component: ProjectconfComponent;
  let fixture: ComponentFixture<ProjectconfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectconfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectconfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
