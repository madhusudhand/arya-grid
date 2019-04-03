import { TestBed } from '@angular/core/testing';

import { AryaGridService } from './arya-grid.service';

describe('AryaGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AryaGridService = TestBed.get(AryaGridService);
    expect(service).toBeTruthy();
  });
});
