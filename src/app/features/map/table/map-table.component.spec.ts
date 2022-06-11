import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';
import { MapTableComponent } from '@features/map/table/map-table.component';

describe('MapTableComponent', () => {

  let component: MapTableComponent;
  let fixture: ComponentFixture<MapTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapTableComponent],
      imports: [
        /** Angular */
        BrowserAnimationsModule,
        /** App */
        SharedModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges - 1 (shelters not changed)', () => {
    component.ngOnChanges({});
    expect(component.shelterDataSource.data).toEqual([]);
  });

  it('ngOnChanges - 2 (shelters changed)', () => {
    component.shelters = [{
      name: 'shelter',
      address: 'Japan',
      latitude: 35.4122,
      longitude: 139.413,
      type: {} as any,
      note: 'note',
    }];
    const changes = {shelters: {currentValue: component.shelters}};
    component.ngOnChanges(changes as any);
    expect(component.shelterDataSource.data).toEqual(component.shelters);
  });

  it('ngAfterViewInit - 1 (no paginator)', () => {
    component.paginator = undefined;
    component.shelterDataSource.paginator = null;
    component.ngAfterViewInit();
    expect(component.shelterDataSource.paginator).toBeNull();
  });

  it('ngAfterViewInit - 2 (paginator exists)', () => {
    component.shelters = [{
      name: 'shelter',
      address: 'Japan',
      latitude: 35.4122,
      longitude: 139.413,
      type: {} as any,
      note: 'note',
    }];
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(component.shelterDataSource.paginator).toBeTruthy();
  });

});
