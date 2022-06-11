import { TestBed } from '@angular/core/testing';
import { createShelterFromCsv } from '@core/models/shelter.model';
import { ApiService } from '@core/services/api/api.service';
import { ShelterService } from '@core/services/api/shelter.service';
import { createSpyObjFrom, injectAsSpyObj } from '@tests/helper';

describe('ShelterService', () => {

  let service: ShelterService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ShelterService,
        {provide: ApiService, useValue: createSpyObjFrom(ApiService)},
      ],
    });

    service = TestBed.inject(ShelterService);
    apiService = injectAsSpyObj(ApiService);
  });

  it('csv', () => {
    service.csv();
    expect(apiService.csv).toHaveBeenCalledOnceWith(service.api, createShelterFromCsv);
  })

});
