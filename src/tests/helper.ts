import { ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/* eslint-disable-next-line arrow-body-style */
export const spyOnGetter = <T, K extends keyof T>(target: T, key: K): jasmine.Spy => {
  return Object.getOwnPropertyDescriptor(target, key)?.get as jasmine.Spy;
};

/* eslint-disable-next-line arrow-body-style */
export const spyOnSetter = <T, K extends keyof T>(target: jasmine.SpyObj<T>, key: K): jasmine.Spy => {
  return Object.getOwnPropertyDescriptor(target, key)?.set as jasmine.Spy;
};

/* eslint-disable-next-line arrow-body-style */
export const injectAsSpyObj = <T>(token: ProviderToken<T>): jasmine.SpyObj<T> => {
  return TestBed.inject(token) as jasmine.SpyObj<T>;
};

/* eslint-disable-next-line @typescript-eslint/ban-types */
export const createSpyObjFrom = (constructor: Function): jasmine.SpyObj<any> => {
  const descriptors = Object.getOwnPropertyDescriptors(constructor.prototype);

  // Getter properties
  const getters = Object.keys(descriptors)
    .map(key => descriptors[key].get)
    .filter(g => g != null)
    .map(g => g?.name.replace('get ', ''));
  // Setter properties
  const setters = Object.keys(descriptors)
    .map(key => descriptors[key].set)
    .filter(s => s != null)
    .map(s => s?.name.replace('set ', ''));
  // Functions
  const functions = Object.keys(descriptors)
    .map(key => descriptors[key].value)
    .filter(v => v != null)
    .map(v => v?.name);

  return jasmine.createSpyObj(constructor.name, functions, getters.concat(setters));
};
