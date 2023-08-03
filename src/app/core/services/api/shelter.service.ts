import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequest } from '@core/interfaces/api-request.interface';
import { createShelterFromCsv, Shelter } from '@core/models/shelter.model';
import { ApiService } from '@core/services/api/api.service';
import { environment } from '@environments/environment';

/**
 * A service which handles shelters csv.
 */
@Injectable({providedIn: 'root'})
export class ShelterService implements ApiRequest<Shelter> {

  readonly api = `${environment.url}/assets/csv/shelters.csv`;

  constructor(private apiService: ApiService) {}

  csv(): Observable<Shelter[]> {
    return this.apiService.csv(this.api, createShelterFromCsv);
  }

}
