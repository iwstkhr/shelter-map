import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, switchMap, toArray } from 'rxjs';
import { Papa } from 'ngx-papaparse';

/**
 * A service which handles API communication.
 */
@Injectable({providedIn: 'root'})
export class ApiService {

  constructor(
    private http: HttpClient,
    private papa: Papa,
  ) {}

  /**
   * Get corresponding model instances parsed from csv records.
   *
   * @param api
   * @param to A function for transforming a csv record into a model
   * @param options CSV parsing options
   */
  csv<T>(
    api: string,
    to: (item: any) => T,
    options?: {
      header?: boolean,
      transformHeader?: (header: string) => string,
    }
  ): Observable<T[]> {

    return this.http
      .get(api, {observe: 'body', responseType: 'text'})
      .pipe(
        map(body => this.papa.parse(body, {
          skipEmptyLines: true,
          header: options?.header,
          transformHeader: options?.transformHeader,
        })),
        switchMap(result => from(result.data)),
        map(item => to(item)),
        toArray(),
      );
  }

}
