import { NgModule } from '@angular/core';
import { MapPage } from '@features/map/map.page';
import { MapRoutingModule } from '@features/map/map-routing.module';
import { MapService } from '@features/map/map.service';
import { SharedModule } from '@shared/shared.module';
import { MapSearchComponent } from './search/map-search.component';
import { MapTableComponent } from './table/map-table.component';

@NgModule({
  declarations: [
    MapPage,
    MapSearchComponent,
    MapTableComponent
  ],
  imports: [
    SharedModule,
    MapRoutingModule,
  ],
  providers: [MapService],
})
export class MapModule {}
