import { TestBed } from '@angular/core/testing';
import { EMPTY, of, Subject } from 'rxjs';
import { createSpyObjFrom, injectAsSpyObj } from '@tests/helper';
import { ShelterService } from '@core/services/api/shelter.service';
import { MapService } from '@features/map/map.service';

describe('MapService', () => {

  let service: MapService;
  let shelterService: jasmine.SpyObj<ShelterService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        MapService,
        {provide: ShelterService, useValue: createSpyObjFrom(ShelterService)},
      ],
    });

    service = TestBed.inject(MapService);
    shelterService = injectAsSpyObj(ShelterService);
  });

  it('constructor', () => {
    expect(service['tileLayerOsm']).toBeTruthy();
    expect(service['tileLayerGiaPhoto']).toBeTruthy();
  });

  it('init', () => {
    shelterService.csv.and.returnValue(EMPTY);
    service['getMap'] = jasmine.createSpy().and.returnValue(jasmine.createSpyObj(['on']));
    service.init(new Subject());
    expect(shelterService.csv).toHaveBeenCalledTimes(1);
    expect(service['getMap']).toHaveBeenCalledOnceWith('map');
    expect((service['leafletMap'] as jasmine.SpyObj<any>).on).toHaveBeenCalledTimes(2);
  });

  it('changeTileLayer - 1 (leafletMap undefined)', () => {
    service['leafletMap'] = undefined;
    spyOn(service['tileLayerOsm'], 'remove');
    service.changeTileLayer('osm');
    expect(service['tileLayerOsm'].remove).toHaveBeenCalledTimes(0);
  });

  it('changeTileLayer - 2 (leafletMap truthy)', () => {
    service['leafletMap'] = jasmine.createSpyObj(['addLayer']);
    spyOn(service['tileLayerOsm'], 'remove');
    spyOn(service['tileLayerGiaPhoto'], 'remove');

    service.changeTileLayer('osm');
    expect(service['tileLayerOsm'].remove).toHaveBeenCalledTimes(1);
    expect(service['tileLayerGiaPhoto'].remove).toHaveBeenCalledTimes(1);
    expect(service['leafletMap']?.addLayer).toHaveBeenCalledOnceWith(service['tileLayerOsm']);
  });

  it('changeTileLayer - 3 (leafletMap truthy)', () => {
    service['leafletMap'] = jasmine.createSpyObj(['addLayer']);
    spyOn(service['tileLayerOsm'], 'remove');
    spyOn(service['tileLayerGiaPhoto'], 'remove');

    service.changeTileLayer('gia_photo');
    expect(service['tileLayerOsm'].remove).toHaveBeenCalledTimes(1);
    expect(service['tileLayerGiaPhoto'].remove).toHaveBeenCalledTimes(1);
    expect(service['leafletMap']?.addLayer).toHaveBeenCalledOnceWith(service['tileLayerGiaPhoto']);
  });

  it('update', () => {
    const shelters = [{}] as any;
    service['shelters$'] = of(shelters);
    service['filterShelterByKeyword'] = jasmine.createSpy().and.returnValue(shelters);
    service['filterSheltersWithinMap'] = jasmine.createSpy().and.returnValue(shelters);
    spyOn(service['onUpdateSheltersSubject$'], 'next');
    service['renderShelterCircles'] = jasmine.createSpy();
    service['renderShelterMarkers'] = jasmine.createSpy();

    service.update('keyword');
    expect(service['filterShelterByKeyword']).toHaveBeenCalledOnceWith(shelters, 'keyword');
    expect(service['filteredShelters']).toEqual(shelters);
    expect(service['renderShelterCircles']).toHaveBeenCalledOnceWith(service['filteredShelters']);
    expect(service['filterSheltersWithinMap']).toHaveBeenCalledOnceWith(service['filteredShelters']);
    expect(service['onUpdateSheltersSubject$'].next).toHaveBeenCalledOnceWith(service['displayedShelters']);
    expect(service['renderShelterMarkers']).toHaveBeenCalledOnceWith(service['displayedShelters']);
  });

  it('renderShelterCircles', () => {
    service['clearShelterCircles'] = jasmine.createSpy();
    service['addShelterCircles'] = jasmine.createSpy();
    service['renderShelterCircles']([]);
    expect(service['clearShelterCircles']).toHaveBeenCalledTimes(1);
    expect(service['addShelterCircles']).toHaveBeenCalledOnceWith([]);
  });

  it('renderShelterMarkers', () => {
    service['clearShelterMarkers'] = jasmine.createSpy();
    service['addShelterMarkers'] = jasmine.createSpy();
    service['renderShelterMarkers']([]);
    expect(service['clearShelterMarkers']).toHaveBeenCalledTimes(1);
    expect(service['addShelterMarkers']).toHaveBeenCalledOnceWith([]);
  });

  it('clearShelterCircles', () => {
    service['shelterCircles'] = [jasmine.createSpyObj(['remove'])];
    service['clearShelterCircles']();
    expect(service['shelterCircles'][0].remove).toHaveBeenCalledTimes(1);
  });

  it('clearShelterMarkers', () => {
    service['shelterMarkers'] = [jasmine.createSpyObj(['remove'])];
    service['clearShelterMarkers']();
    expect(service['shelterMarkers'][0].remove).toHaveBeenCalledTimes(1);
  });

});
