import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MapService } from '@features/map/map.service';
import { Shelter } from '@core/models/shelter.model';

@Component({
  selector: 'app-map-page',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPage implements OnInit, OnDestroy {

  shelters: Shelter[] = [];
  private readonly onDestroy$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private mapService: MapService,
  ) {}

  ngOnInit() {
    this.mapService.onUpdateShelters$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(shelters => {
        this.shelters = shelters;
        this.cd.markForCheck();
      });
    this.mapService.init(this.onDestroy$);
    this.mapService.changeTileLayer('osm');
    this.mapService.update();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  onKeywordChanges(keyword: string): void {
    this.mapService.update(keyword);
  }

  onTileLayerChanges(name: string): void {
    this.mapService.changeTileLayer(name as 'osm'|'gia_photo');
  }

}
