import { TestBed } from '@angular/core/testing';

import { ThemeSwitcheService } from './theme-switche.service';

describe('ThemeSwitcheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThemeSwitcheService = TestBed.get(ThemeSwitcheService);
    expect(service).toBeTruthy();
  });
});
