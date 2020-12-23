/**
 * @file Utilities for writing JavaScript code that runs in KoLmafia.
 */

import {getRevision} from 'kolmafia';

/**
 * Represents an exception thrown when the current KoLmafia version does not
 * match an expected condition.
 */
export class KolmafiaVersionError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

/**
 * Returns the currently executing script name, suitable for embedding in an
 * error message.
 * @returns Path of the main script wrapped in single-quotes, or `"This script"`
 *    if the path cannot be determined
 */
function getScriptName(): string {
  // In Rhino, the current script name is available in require.main.id
  const scriptName = require.main?.id;
  return scriptName ? `'${scriptName}'` : 'This script';
}

/**
 * If KoLmafia's revision number is less than `revision`, throws an exception.
 * Otherwise, does nothing.
 *
 * This behaves like the `since rXXX;` statement in ASH.
 * @param revision Revision number
 * @throws {KolmafiaVersionError}
 *    If KoLmafia's revision number is less than `revision`.
 * @throws {TypeError} If `revision` is not an integer
 */
export function sinceKolmafiaRevision(revision: number): void {
  if (!Number.isInteger(revision)) {
    throw new TypeError(
      `Invalid revision number ${revision} (must be an integer)`
    );
  }

  // Based on net.sourceforge.kolmafia.textui.Parser.sinceException()
  if (getRevision() < revision) {
    throw new KolmafiaVersionError(
      `${getScriptName()} requires revision r${revision} of kolmafia or higher (current: ${getRevision()}). Up-to-date builds can be found at https://ci.kolmafia.us/.`
    );
  }
}
