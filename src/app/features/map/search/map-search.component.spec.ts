import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';
import { MapSearchComponent } from '@features/map/search/map-search.component';

describe('MapSearchComponent', () => {

  let component: MapSearchComponent;
  let fixture: ComponentFixture<MapSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapSearchComponent],
      imports: [
        /** Angular */
        BrowserAnimationsModule,
        /** App */
        SharedModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit - 1', () => {
    component['subscribeValueChanges'] = jasmine.createSpy();
    component.ngOnInit();
    expect(component['subscribeValueChanges']).toHaveBeenCalledTimes(1);
  });

  it('ngOnDestroy - 1', () => {
    spyOn(component['onDestroy$'], 'next');
    component.ngOnDestroy();
    expect(component['onDestroy$'].next).toHaveBeenCalledTimes(1);
  });

});
