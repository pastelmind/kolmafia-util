# kolmafia-util

KoLmafia-util is a utility library for writing JavaScript/TypeScript programs that run inside KoLmafia.

It provides some useful features in ASH that are not available in the JavaScript runtime.

## Installing

If your JavaScript project uses a bundler (Webpack, Rollup, etc.), use:

```
npm install kolmafia-util
```

Support for `dependencies.txt` is coming soon.

## Usage and API

If you are using a bundler, you can import and

```js
import {sinceKolmafiaVersion} 'kolmafia-util';

sinceKolmafiaVersion(20, 7);
```

The following is a list of functions and classes exported by kolmafia-util.

### sinceKolmafiaRevision

```ts
function sinceKolmafiaRevision(revision: number): void;
```

This function checks KoLmafia's revision number against `revision`. If the current revision is smaller, it throws a `KolmafiaVersionError` containing a helpful error message. Otherwise, it does nothing.

This function is similar to the [since](https://wiki.kolmafia.us/index.php/Since) statement in ASH. Specifically, it behaves like the `since rXXX;` statement.

Example:

```ts
import {sinceKolmafiaRevsion} from 'kolmafia-util';

// Ensure that KoLmafia's revision is at least r20505
sinceKolmafiaRevsion(20505);
```

### sinceKolmafiaVersion

```ts
function sinceKolmafiaVersion(majorVersion: number, minorVersion: number): void;
```

This function checks KoLmafia's version against `majorVersion` and `minorVersion`. If the current version is lesser, it throws a `KolmafiaVersionError` containing a helpful error message. Otherwise, it does nothing.

This function is similar to the [since](https://wiki.kolmafia.us/index.php/Since) statement in ASH. Specifically, it behaves like the `since XX.YY;` statement.

Example:

```ts
import {sinceKolmafiaVersion} from 'kolmafia-util';

// Ensure that KoLmafia's version is at least v20.7
sinceKolmafiaVersion(20, 7);
```

### KolmafiaVersionError

A custom error class used by `sinceKolmafiaRevision()` and `sinceKolmafiaVersion()`.
