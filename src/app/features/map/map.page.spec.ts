import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SharedModule } from '@shared/shared.module';
import { createSpyObjFrom, injectAsSpyObj, spyOnGetter } from '@tests/helper';
import { MapPage } from '@features/map/map.page';
import { MapSearchComponent } from '@features/map/search/map-search.component';
import { MapTableComponent } from '@features/map/table/map-table.component';
import { MapService } from '@features/map/map.service';

describe('MapPage', () => {

  let component: MapPage;
  let fixture: ComponentFixture<MapPage>;
  let mapService: jasmine.SpyObj<MapService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MapPage,
        MapSearchComponent,
        MapTableComponent,
      ],
      imports: [
        /** Angular */
        BrowserAnimationsModule,
        /** App */
        SharedModule,
      ],
      providers: [
        {provide: MapService, useValue: createSpyObjFrom(MapService)},
      ],
    })
    .compileComponents();

    mapService = injectAsSpyObj(MapService);
    spyOnGetter(mapService, 'onUpdateShelters$').and.returnValue(of([]));

    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', (() => {
    const shelters = [{
      name: 'shelter',
      address: 'Japan',
      latitude: 35.4122,
      longitude: 139.413,
      type: {} as any,
      note: 'note',
    }];
    spyOnGetter(mapService, 'onUpdateShelters$').and.returnValue(of(shelters));
    spyOn(component['cd'], 'markForCheck');

    component.ngOnInit();
    expect(component.shelters).toEqual(shelters);
    expect(component['cd'].markForCheck).toHaveBeenCalledTimes(1);
    expect(mapService.init).toHaveBeenCalledOnceWith(component['onDestroy$']);
    expect(mapService.changeTileLayer).toHaveBeenCalledOnceWith('osm');
    expect(mapService.update).toHaveBeenCalledTimes(1);
  }));

  it('ngOnDestroy', () => {
    spyOn(component['onDestroy$'], 'next');
    component.ngOnDestroy();
    expect(component['onDestroy$'].next).toHaveBeenCalledTimes(1);
  });

  it('onKeywordChanges', () => {
    const keyword = 'Hello world';
    component.onKeywordChanges(keyword);
    expect(mapService.update).toHaveBeenCalledOnceWith(keyword);
  });

  it('onTileLayerChanges', () => {
    component.onTileLayerChanges('gia_photo');
    expect(mapService.changeTileLayer).toHaveBeenCalledOnceWith('gia_photo');
  });

});
