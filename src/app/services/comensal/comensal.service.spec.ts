import { TestBed } from '@angular/core/testing';

import { ComensalService } from './comensal.service';

describe('ComensalService', () => {
  let service: ComensalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComensalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
