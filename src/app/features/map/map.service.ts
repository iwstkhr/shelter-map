import { Injectable } from '@angular/core';
import {
  map,
  Observable,
  ObservableInput,
  of,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import { LatLngExpression } from 'leaflet';
import * as L from 'leaflet';
import { Shelter } from '@core/models/shelter.model';
import { ShelterTypeEnum, ShelterTypeJapanese } from '@core/models/shelter-type.model';
import { ShelterService } from '@core/services/api/shelter.service';

/**
 * A service for map page feature
 */
@Injectable()
export class MapService {

  /** Map center coordinates */
  private readonly center: LatLngExpression = [35.4122, 139.413];
  private readonly initialZoom = 8;

  /** Tiles layer by OpenStreetMap */
  private readonly tileLayerOsm: L.TileLayer;
  /** Tiles layer by Geospatial Information Authority of Japan */
  private readonly tileLayerGiaPhoto: L.TileLayer;
  /** Leaflet map */
  private leafletMap?: L.Map;
  /** Circles of shelters */
  private shelterCircles: L.Circle[] = [];
  /** Markers of shelters */
  private shelterMarkers: L.Marker[] = [];
  /** Observable to stream shelters */
  private shelters$: Observable<Shelter[]> = of([]);
  /** Notifier when shelters updated */
  private readonly onUpdateSheltersSubject$ = new Subject<Shelter[]>();
  /** Filtered shelters */
  private filteredShelters: Shelter[] = [];
  /** Displayed shelters */
  private displayedShelters: Shelter[] = [];

  /**
   * Get an infinite observable to get updated shelters.
   *
   * @remarks
   * Make sure that the observable will be unsubscribed when becomes unnecessary.
   */
  get onUpdateShelters$(): Observable<Shelter[]> {
    return this.onUpdateSheltersSubject$.asObservable();
  }

  constructor(private shelterService: ShelterService) {
    this.tileLayerOsm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 5,
      maxZoom: 18,
      attribution: '© OpenStreetMap',
    });
    this.tileLayerGiaPhoto = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {
      minZoom: 5,
      maxZoom: 18,
      attribution: '© 国土地理院',
    });
  }

  /**
   * Initialize a leaflet map.
   *
   * @param destroy$ A notifier for unsubscribing
   */
  init(destroy$: ObservableInput<any>): void {
    this.shelters$ = this.shelterService.csv().pipe(shareReplay(), takeUntil(destroy$));
    this.leafletMap = this.getMap('map');
    const updateMarkers = () => {
      this.displayedShelters = this.filterSheltersWithinMap(this.filteredShelters);
      this.onUpdateSheltersSubject$.next(this.displayedShelters);
      this.renderShelterMarkers(this.displayedShelters);
    };
    this.leafletMap.on('zoomlevelschange', () => updateMarkers());
    this.leafletMap.on('moveend', () => updateMarkers());
  }

  /**
   * Change tile layers.
   *
   * @param tileLayer
   */
  changeTileLayer(tileLayer: 'osm'|'gia_photo'): void {
    if (!this.leafletMap) {
      return;
    }

    // Remove tile layers.
    this.tileLayerOsm.remove();
    this.tileLayerGiaPhoto.remove();

    // Add a corresponding tile layer.
    if (tileLayer === 'osm') {
      this.leafletMap.addLayer(this.tileLayerOsm);
    } else if (tileLayer === 'gia_photo') {
      this.leafletMap.addLayer(this.tileLayerGiaPhoto);
    }
  }

  /**
   * Update a leaflet map using a specified keyword.
   *
   * @param keyword
   */
  update(keyword?: string): void {
    this.shelters$
      .pipe(map(shelters => this.filterShelterByKeyword(shelters, keyword)))
      .subscribe(shelters => {
        this.filteredShelters = shelters;
        // Render all filtered shelter circles because of light load compared to render markers.
        this.renderShelterCircles(this.filteredShelters);

        this.displayedShelters = this.filterSheltersWithinMap(this.filteredShelters);
        this.onUpdateSheltersSubject$.next(this.displayedShelters);
        this.renderShelterMarkers(this.displayedShelters);
      });
  }

  /**
   * Render circles of shelters.
   *
   * @param shelters
   * @private
   */
  private renderShelterCircles(shelters: Shelter[]): void {
    this.clearShelterCircles();
    this.addShelterCircles(shelters);
  }

  /**
   * Render markers of shelters.
   *
   * @param shelters
   * @private
   */
  private renderShelterMarkers(shelters: Shelter[]): void {
    this.clearShelterMarkers();
    this.addShelterMarkers(shelters);
  }

  /**
   * Clear existing shelter circles.
   *
   * @private
   */
  private clearShelterCircles(): void {
    this.shelterCircles.forEach(circle => circle.remove());
  }

  /**
   * Clear existing shelter markers.
   *
   * @private
   */
  private clearShelterMarkers(): void {
    this.shelterMarkers.forEach(marker => marker.remove());
  }

  /**
   * Add shelter circles.
   *
   * @param shelters
   * @private
   */
  private addShelterCircles(shelters: Shelter[]): void {
    this.shelterCircles = shelters
      .map(shelter => {
        const circle = L.circle(
          [shelter.latitude, shelter.longitude],
          {radius: 20, color: this.getRandomColor()}
        );
        return this.leafletMap
          ? circle.bindPopup(this.getPopupContent(shelter)).addTo(this.leafletMap)
          : undefined;
      })
      .filter(Boolean) as L.Circle[];
  }

  /**
   * Add shelter markers.
   *
   * @param shelters
   * @private
   */
  private addShelterMarkers(shelters: Shelter[]): void {
    if ((this.leafletMap?.getZoom() ?? 0) < 15 && shelters.length > 100) {
      return;
    }

    this.shelterMarkers = shelters
      .map(shelter => {
        if (this.leafletMap) {
          return L.marker([shelter.latitude, shelter.longitude])
            .bindPopup(this.getPopupContent(shelter))
            .addTo(this.leafletMap);
        } else {
          return undefined;
        }
      })
      .filter(Boolean) as L.Marker[];
  }

  /**
   * Get a popup content of a shelter.
   *
   * @param shelter
   * @private
   */
  private getPopupContent(shelter: Shelter): string {
    let popup = `<strong>${shelter.name}</strong><br/>${shelter.address}<hr/>`;
    popup += Object.keys(shelter.type)
      .map(key => [(shelter.type as any)[key], ShelterTypeJapanese.get(key as ShelterTypeEnum)])
      .map(value => {
        const [ready, name] = value;
        return ready
          ? `<span class="app-content-ready">${name}</span>`
          : `<span class="app-content-not-ready">${name}</span>`;
      })
      .reduce((acc, cur) => acc + cur + '<br/>', '');
    return popup;
  }

  /**
   * Filter shelters by a specified keyword.
   *
   * @param shelters
   * @param keyword
   * @private
   */
  private filterShelterByKeyword(shelters: Shelter[], keyword?: string): Shelter[] {
    if (keyword == null) {
      return shelters;
    }
    return shelters.filter(shelter => {
      return shelter.name.includes(keyword) || shelter.address.includes(keyword) || shelter.note.includes(keyword);
    });
  }

  /**
   * Filter shelters within the map rectangle.
   *
   * @param shelters
   * @private
   */
  private filterSheltersWithinMap(shelters: Shelter[]): Shelter[] {
    return shelters.filter(shelter => {
      return this.leafletMap?.getBounds().contains([shelter.latitude, shelter.longitude]);
    });
  }

  /**
   * Get a hex string expression of a random color.
   *
   * @private
   */
  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 200);
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
  }

  private getMap(id: string): L.Map {
    return L.map(id, {preferCanvas: true}).setView(this.center, this.initialZoom);
  }

}
