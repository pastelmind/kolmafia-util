/**
 * @file Utilities for temporarily modifying the game state before executing
 * some code, then restoring the original settings even if the program fails.
 */

import {
  cliExecute,
  disable,
  enable,
  getProperty,
  haveFamiliar,
  myFamiliar,
  outfit,
  setProperty,
  useFamiliar,
} from 'kolmafia';

/**
 * Temporarily disable one or more ASH functions while executing a callback.
 *
 * To disable built-in KoLmafia functions, use their ASH names  instead of
 * JavaScript names (e.g.`"user_confirm"` instead of `"userConfirm"`).
 *
 * This can also disable any user-defined functions in ASH scripts called by
 * `callback()`. However, this cannot disable any user-defined JavaScipt
 * functions.
 * @param functionNames List of function names to disable, separated by
 *    whitespace (` `) or comma (`,`). The special value `"all"` will disable
 *    all ASH functions (both built-in and user-defined).
 * @param callback Callback to run
 * @return Return value of callback
 */
export function withDisabledFunctions<T>(
  functionNames: string,
  callback: () => T
): T {
  disable(functionNames);

  try {
    return callback();
  } finally {
    enable(functionNames);
  }
}

/**
 * Temporarily changes the current familiar while executing a callback.
 * @param familiar Familiar to use
 * @param callback Callback to run
 * @return Return value of callback
 */
export function withFamiliar<T>(familiar: Familiar, callback: () => T): T {
  const previousFamiliar = myFamiliar();
  if (!useFamiliar(familiar)) {
    throw new Error(`Failed to take out familiar: ${familiar}`);
  }

  try {
    return callback();
  } finally {
    useFamiliar(previousFamiliar);
  }
}

/**
 * Temporarily changes the current familiar _only if you own it_ while executing
 * a callback.
 * @param familiar Familiar to use. If you do not own this familiar, the
 *    callback will be executed without changing the current familiar.
 *    If this is `none`, this function will always change the current familiar
 *    to `none`.
 * @param callback Callback to run
 * @return Return value of callback
 */
export function withFamiliarIfOwned<T>(
  familiar: Familiar,
  callback: () => T
): T {
  return haveFamiliar(familiar) || familiar === Familiar.get('none')
    ? withFamiliar(familiar, callback)
    : callback();
}

/**
 * Saves your current outfit using the `checkpoint` gCLI command, executes a
 * callback, then restores the saved outfit.
 * @param callback Callback to run
 * @return Return value of callback
 */
export function withOutfitCheckpoint<T>(callback: () => T): T {
  if (!cliExecute('checkpoint')) {
    throw new Error('withOutfitCheckpoint(): failed to create checkpoint');
  }

  try {
    return callback();
  } finally {
    if (!outfit('checkpoint')) {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(
        'withOutfitCheckpoint(): Failed to restore previous outfit'
      );
    }
  }
}

/**
 * Temporarily changes KoLmafia properties while executing a callback.
 * @param properties Object whose keys are property names and values are
 *    property values
 * @param callback Callback to run
 * @return Return value of callback
 */
export function withProperties<T>(
  properties: Record<string, string>,
  callback: () => T
): T {
  const oldProperties: [string, string][] = Object.keys(properties).map(
    name => [name, getProperty(name)]
  );
  for (const name of Object.keys(properties)) {
    setProperty(name, properties[name]);
  }

  try {
    return callback();
  } finally {
    for (const [name, oldValue] of oldProperties) {
      setProperty(name, oldValue);
    }
  }
}
