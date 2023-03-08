import { TestBed } from '@angular/core/testing';

import { DecoracionService } from './decoracion.service';

describe('DecoracionService', () => {
  let service: DecoracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoracionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
