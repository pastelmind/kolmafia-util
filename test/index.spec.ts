import mock = require('mock-require');

mock('kolmafia', {getRevision: () => 20000});

import {KolmafiaVersionError, sinceKolmafiaRevision} from '../src';

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
