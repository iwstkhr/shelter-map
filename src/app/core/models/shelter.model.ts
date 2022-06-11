import { ShelterType } from '@core/models/shelter-type.model';

/**
 * Shelter model
 */
export interface Shelter {
  name: string;
  address: string;
  type: ShelterType;
  latitude: number;
  longitude: number;
  note: string;
}

/**
 * Convert an object like Shelter into Shelter.
 *
 * @param item
 */
export const toShelter = <T extends Shelter>(item: T): Shelter => {
  return {
    name: item.name,
    address: item.address,
    type: {
      flood: item.type.flood,
      landslide: item.type.landslide,
      storm_surge: item.type.storm_surge,
      earthquake: item.type.earthquake,
      tsunami: item.type.tsunami,
      big_fire: item.type.big_fire,
      flood_within_levee: item.type.flood_within_levee,
      volcanic_activity: item.type.volcanic_activity,
    },
    latitude: item.latitude,
    longitude: item.longitude,
    note: item.note,
  };
};

/**
 * Create a Shelter model from a csv record.
 *
 * @param item
 */
export const createShelterFromCsv = (item: any[]): Shelter => {
  return {
    name: item[3],
    address: item[4],
    type: {
      flood: item[5] === '1',
      landslide: item[6] === '1',
      storm_surge: item[7] === '1',
      earthquake: item[8] === '1',
      tsunami: item[9] === '1',
      big_fire: item[10] === '1',
      flood_within_levee: item[11] === '1',
      volcanic_activity: item[12] === '1',
    },
    latitude: parseFloat(item[14]),
    longitude: parseFloat(item[15]),
    note: item[16],
  };
};
