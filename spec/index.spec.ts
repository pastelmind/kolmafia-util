import td = require('testdouble');

td.replace('kolmafia', {
  getRevision: () => 20000,
  getVersion: () => 'KoLmafia v15.3',
});

import {
  KolmafiaVersionError,
  sinceKolmafiaRevision,
  sinceKolmafiaVersion,
} from '../src';

describe('sinceKolmafiaRevision()', () => {
  it('Must allow valid versions', () => {
    sinceKolmafiaRevision(20000);
    sinceKolmafiaRevision(19999);
    sinceKolmafiaRevision(0);
  });

  it('Must disallow versions greater than the current version', () => {
    expect(() => sinceKolmafiaRevision(30000)).toThrowError(
      KolmafiaVersionError,
      /requires revision r30000.+20000/
    );
    expect(() => sinceKolmafiaRevision(20001)).toThrowError(
      KolmafiaVersionError,
      /requires revision r20001.+20000/
    );
  });

  it('Must disallow non-integers', () => {
    // Only integers are allowed
    expect(() => sinceKolmafiaRevision(20000.1)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision('20000')).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision(/20000/)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision(undefined)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision(null)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision()).toThrowError(TypeError);
  });
});

describe('sinceKolmafiaVersion()', () => {
  it('Must allow valid versions', () => {
    sinceKolmafiaVersion(15, 3);
    sinceKolmafiaVersion(15, 2);
    sinceKolmafiaVersion(14, 9);
  });

  it('Must disallow versions greater than the current version', () => {
    expect(() => sinceKolmafiaVersion(15, 4)).toThrowError(
      KolmafiaVersionError,
      /requires version 15\.4.+15\.3/
    );
    expect(() => sinceKolmafiaVersion(16, 0)).toThrowError(
      KolmafiaVersionError,
      /requires version 16\.0.+15\.3/
    );
  });

  it('Must disallow non-integers', () => {
    // Only integers are allowed
    expect(() => sinceKolmafiaVersion(15.1, 0)).toThrowError(TypeError);
    expect(() => sinceKolmafiaVersion(0, 15.1)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion('15', 0)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(0, '15')).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(/15/, 0)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(0, /15/)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(undefined, 0)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(0, undefined)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(null, 0)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(0, null)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(15)).toThrowError(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion()).toThrowError(TypeError);
  });
});
