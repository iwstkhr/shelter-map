import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss']
})
export class MapSearchComponent implements OnInit, OnDestroy {

  @Output() onKeywordChanges = new EventEmitter<string>();
  @Output() onTileLayerChanges = new EventEmitter<string>();

  readonly form: FormGroup = this.fb.group({
    keyword: ['', [Validators.maxLength(40)]],
    tile_layer: ['osm', [Validators.pattern(/^(osm|gia_photo)$/)]],
  });
  private readonly onDestroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.subscribeValueChanges();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  /**
   * Subscribe value changes of form controls.
   *
   * @private
   */
  private subscribeValueChanges(): void {
    this.form.get('keyword')?.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(200),
      )
      .subscribe(keyword => this.onKeywordChanges.emit(keyword));

    this.form.get('tile_layer')?.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(200),
      )
      .subscribe(mapType => this.onTileLayerChanges.emit(mapType))
  }

}
