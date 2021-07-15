# kolmafia-util

[![Test & Lint status](https://github.com/pastelmind/kolmafia-util/workflows/Test%20&%20Lint/badge.svg)](https://github.com/pastelmind/kolmafia-util/actions?query=workflow%3A%22Test+%26+Lint%22) [![npm](https://img.shields.io/npm/v/kolmafia-util)](https://www.npmjs.com/package/kolmafia-util)

KoLmafia-util is a utility library for writing JavaScript/TypeScript programs that run inside KoLmafia.

It provides some useful features for writing JavaScript-based KoLmafia projects.

## Installing

If your JavaScript project uses a bundler (Webpack, Rollup, etc.), use:

```
npm install kolmafia-util
```

Support for `dependencies.txt` is coming soon.

## Usage

If you are using a bundler, you can import and use kolmafia-util like this:

```js
import {sinceKolmafiaVersion} from 'kolmafia-util';

sinceKolmafiaVersion(20, 7);
```

## API

The following is a list of functions and classes exported by kolmafia-util.

### `sinceKolmafiaRevision()`

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

### `sinceKolmafiaVersion()`

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

### `KolmafiaVersionError`

A custom error class used by `sinceKolmafiaRevision()` and `sinceKolmafiaVersion()`. You can use it with `instanceof` to manually handle version errors:

```ts
import {KolmafiaVersionError, sinceKolmafiaVersion} from 'kolmafia-util';

try {
  sinceKolmafiaVersion(20, 7);
} catch (err) {
  if (err instanceof KolmafiaVersionError) {
    // Your own code
  }
}
```

### `withDisabledFunctions()`

Temporarily disable one or more ASH functions while executing a callback.

```ts
// Disables the userConfirm() function while executing the callback
const someValue = withDisabledFunctions('user_confirm', () => {
  /* ... */
  return someValue;
});
```

### `withFamiliar()`

Temporarily changes the current familiar while executing a callback.

```ts
const someValue = withFamiliar(Familiar.get('Slimeling'), () => {
  /* ... */
  return someValue;
});
```

### `withFamiliarIfOwned()`

Temporarily changes the current familiar _only if you own it_ while executing a callback.

```ts
const someValue = withFamiliarIfOwned(Familiar.get('Slimeling'), () => {
  /* ... */
  return someValue;
});
```

### `withOutfitCheckpoint()`

Saves your current outfit using the `checkpoint` gCLI command, executes a callback, then restores the saved outfit.

```ts
const someValue = withOutfitCheckpoint(() => {
  /* ... */
  return someValue;
});
```

### Assertion Library

kolmafia-util exports a rudimentary assertion library. To import it, use:

```ts
import * as assert from 'kolmafia-util/assert';

assert.ok(someValue());
```

Note that the assertion library do not rely on KoLmafia's library functions. This makes them runnable in almost any JavaScript environment.

#### `ok(cond, [message])`

Asserts that a condition is truthy. This also acts as a TypeScript type assertion, and can participate in type narrowing.

```ts
const a: string | null = getSomething();
assert.ok(a, 'a is falsy');
// This works because assert.ok() narrows the type of a to a string.
const b = a.toLowerCase();
```

#### `fail([message])`

Throws an error, optionally with the given message.

```ts
assert.fail('This should be unreachable');
```

#### `equal(actual, expected, [message])`

Asserts that `actual` is strictly equal (`===`) to `expected`.

```ts
assert.equal(someValue(), 'FOO');
```

#### `notEqual(actual, expected, [message])`

Asserts that `actual` is strictly inequal (`!==`) to `expected`.

```ts
assert.notEqual(someValue(), null);
```

#### `isAtLeast(actual, expected, [message])`

Asserts that `actual` is greater than or equal (`>=`) to `expected`.

```ts
assert.isAtLeast(someValue(), 50);
```

#### `isAtMost(actual, expected, [message])`

Asserts that `actual` is less than or equal (`>=`) to `expected`.

```ts
assert.isAtMost(someValue(), 50);
```

#### `isAbove(actual, expected, [message])`

Asserts that `actual` is greater than (`>`) `expected`.

```ts
assert.isAbove(someValue(), 50);
```

#### `isBelow(actual, expected, [message])`

Asserts that `actual` is less than (`<`) `expected`.

```ts
assert.isBelow(someValue(), 50);
```

#### `AssertionError`

An error class that is thrown by the assertion functions.
