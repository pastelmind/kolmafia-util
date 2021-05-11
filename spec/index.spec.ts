import {expect} from 'chai';
import {replace, replaceEsm, reset} from 'testdouble';

replace('kolmafia', {
  getRevision: () => 20000,
  getVersion: () => 'KoLmafia v15.3',
});

before(async () => {
  await replaceEsm('kolmafia', {
    getRevision: () => 20000,
    getVersion: () => 'KoLmafia v15.3',
  });
});

afterEach(() => {
  reset();
});

describe('sinceKolmafiaRevision()', () => {
  it('Must allow valid versions', async () => {
    const {sinceKolmafiaRevision} = await import('../src/index.js');

    sinceKolmafiaRevision(20000);
    sinceKolmafiaRevision(19999);
    sinceKolmafiaRevision(0);
  });

  it('Must disallow versions greater than the current version', async () => {
    const {KolmafiaVersionError, sinceKolmafiaRevision} = await import(
      '../src/index.js'
    );

    expect(() => sinceKolmafiaRevision(30000)).to.throw(
      KolmafiaVersionError,
      /requires revision r30000.+20000/
    );
    expect(() => sinceKolmafiaRevision(20001)).to.throw(
      KolmafiaVersionError,
      /requires revision r20001.+20000/
    );
  });

  it('Must disallow non-integers', async () => {
    const {sinceKolmafiaRevision} = await import('../src/index.js');

    // Only integers are allowed
    expect(() => sinceKolmafiaRevision(20000.1)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision('20000')).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision(/20000/)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision(undefined)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision(null)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaRevision()).to.throw(TypeError);
  });
});

describe('sinceKolmafiaVersion()', () => {
  it('Must allow valid versions', async () => {
    const {sinceKolmafiaVersion} = await import('../src/index.js');

    sinceKolmafiaVersion(15, 3);
    sinceKolmafiaVersion(15, 2);
    sinceKolmafiaVersion(14, 9);
  });

  it('Must disallow versions greater than the current version', async () => {
    const {KolmafiaVersionError, sinceKolmafiaVersion} = await import(
      '../src/index.js'
    );

    expect(() => sinceKolmafiaVersion(15, 4)).to.throw(
      KolmafiaVersionError,
      /requires version 15\.4.+15\.3/
    );
    expect(() => sinceKolmafiaVersion(16, 0)).to.throw(
      KolmafiaVersionError,
      /requires version 16\.0.+15\.3/
    );
  });

  it('Must disallow non-integers', async () => {
    const {sinceKolmafiaVersion} = await import('../src/index.js');

    // Only integers are allowed
    expect(() => sinceKolmafiaVersion(15.1, 0)).to.throw(TypeError);
    expect(() => sinceKolmafiaVersion(0, 15.1)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion('15', 0)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(0, '15')).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(/15/, 0)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(0, /15/)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(undefined, 0)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(0, undefined)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(null, 0)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(0, null)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion(15)).to.throw(TypeError);
    // @ts-expect-error Only numbers are allowed
    expect(() => sinceKolmafiaVersion()).to.throw(TypeError);
  });
});
