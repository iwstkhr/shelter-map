import { Observable } from 'rxjs';

/**
 * An interface which API services should implement.
 */
export interface ApiRequest<T> {
  /**
   * API endpoint
   */
  readonly api: string;

  /**
   * This can be used for APIs which response csv records.
   *
   * @remarks
   * CSV records are parsed to Object.
   */
  csv?(): Observable<T[]>;
}
