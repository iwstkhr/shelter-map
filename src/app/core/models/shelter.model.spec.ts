import { createShelterFromCsv, toShelter } from '@core/models/shelter.model';

describe('ShelterModel', () => {

  it('toShelter', () => {
    const item = {
      name: 'Adam Smith',
      address: 'Japan',
      type: {
        flood: true,
        landslide: false,
        storm_surge: true,
        earthquake: false,
        tsunami: true,
        big_fire: false,
        flood_within_levee: true,
        volcanic_activity: false,
      },
      latitude: 100.123,
      longitude: 10.123,
      note: 'note',
    };
    expect(toShelter(item)).toEqual(item);
  });

  it('createShelterFromCsv', () => {
    const item = [
      'hello',
      'world',
      '1',
      'Adam Smith',
      'Japan',
      '1',
      null,
      '1',
      null,
      '1',
      null,
      '1',
      null,
      '1',
      '100.123',
      '10.123',
      'note',
    ];
    expect(createShelterFromCsv(item)).toEqual({
      name: 'Adam Smith',
      address: 'Japan',
      type: {
        flood: true,
        landslide: false,
        storm_surge: true,
        earthquake: false,
        tsunami: true,
        big_fire: false,
        flood_within_levee: true,
        volcanic_activity: false,
      },
      latitude: 100.123,
      longitude: 10.123,
      note: 'note',
    });
  });

})
