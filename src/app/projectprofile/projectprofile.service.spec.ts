import { TestBed } from '@angular/core/testing';

import { ProjectprofileService } from './projectprofile.service';

describe('ProjectprofileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectprofileService = TestBed.get(ProjectprofileService);
    expect(service).toBeTruthy();
  });
});
