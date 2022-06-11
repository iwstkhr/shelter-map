import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Papa } from 'ngx-papaparse';
import { ApiService } from '@core/services/api/api.service';
import { createSpyObjFrom, injectAsSpyObj } from '@tests/helper';

describe('ApiService', () => {

  let service: ApiService;
  let papa: jasmine.SpyObj<Papa>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        {provide: Papa, useValue: createSpyObjFrom(Papa)},
      ],
    });

    service = TestBed.inject(ApiService);
    papa = injectAsSpyObj(Papa);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('csv', () => {
    const api = 'https://localhost/api/';
    const to = jasmine.createSpy();
    const options = {header: true, transformHeader: jasmine.createSpy()};
    papa.parse.and.returnValue({data: [{}]} as any);

    service.csv(api, to, options).subscribe(() => {
      expect(papa.parse.calls.mostRecent().args[1]).toEqual({
        skipEmptyLines: true,
        header: options.header,
        transformHeader: options.transformHeader,
      });
      expect(to).toHaveBeenCalledTimes(1);
    });

    const response = [{}];
    const req = httpTestingController.expectOne(api);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  })

});
