import { TestBed } from '@angular/core/testing';

import { AiQueryFacadeService } from './ai-query-facade.service';

describe('AiQueryFacadeService', () => {
  let service: AiQueryFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiQueryFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
