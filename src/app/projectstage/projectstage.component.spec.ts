import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectstageComponent } from './projectstage.component';

describe('ProjectstageComponent', () => {
  let component: ProjectstageComponent;
  let fixture: ComponentFixture<ProjectstageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectstageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectstageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
