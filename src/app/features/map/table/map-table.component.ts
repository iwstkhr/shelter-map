import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Shelter } from '@core/models/shelter.model';
import { ShelterTypeEnum, ShelterTypeJapanese } from '@core/models/shelter-type.model';

@Component({
  selector: 'app-map-table',
  templateUrl: './map-table.component.html',
  styleUrls: ['./map-table.component.scss']
})
export class MapTableComponent implements OnChanges, AfterViewInit {

  @Input() shelters: Shelter[] = [];
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  readonly columns = ['name', 'address'].concat(Object.values(ShelterTypeEnum));
  readonly shelterTypeColumns: string[] = Object.values(ShelterTypeEnum);
  readonly shelterTypeJapanese = ShelterTypeJapanese;
  readonly shelterDataSource = new MatTableDataSource<Shelter>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shelters']?.currentValue) {
      this.shelterDataSource.data = this.shelters;
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.shelterDataSource.paginator = this.paginator;
    }
  }

}
