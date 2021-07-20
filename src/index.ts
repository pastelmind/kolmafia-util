/**
 * @file Utilities for writing JavaScript code that runs in KoLmafia.
 */

import {
  getProperty,
  getRevision,
  getVersion,
  print,
  setProperty,
} from 'kolmafia';
import {kmail} from './kmail';

export * as assert from './assert';
export * from './kmail';
export * from './with';

/**
 * Represents an exception thrown when the current KoLmafia version does not
 * match an expected condition.
 */
export class KolmafiaVersionError extends Error {
  constructor(message?: string) {
    super(message);

    // Explicitly set the prototype, so that 'instanceof' still works in Node.js
    // even when the class is transpiled down to ES5
    // See: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Note that this code isn't needed for Rhino.
    Object.setPrototypeOf(this, KolmafiaVersionError.prototype);
  }
}

// Manually set class name, so that the stack trace shows proper name in Rhino
KolmafiaVersionError.prototype.name = 'KolmafiaVersionError';

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

/**
 * If KoLmafia's version is less than `majorVersion.minorVersion`, throws an
 * exception.
 * Otherwise, does nothing.
 *
 * This behaves like the `since X.Y;` statement in ASH.
 * @param majorVersion Major version number
 * @param minorVersion Minor version number
 * @throws {KolmafiaVersionError}
 *    If KoLmafia's major version is less than `majorVersion`, or if the major
 *    versions are equal but the minor version is less than `minorVersion`
 * @throws {TypeError}
 *    If either `majorVersion` or `minorVersion` are not integers
 */
export function sinceKolmafiaVersion(
  majorVersion: number,
  minorVersion: number
): void {
  if (!Number.isInteger(majorVersion)) {
    throw new TypeError(
      `Invalid major version number ${majorVersion} (must be an integer)`
    );
  }
  if (!Number.isInteger(minorVersion)) {
    throw new TypeError(
      `Invalid minor version number ${minorVersion} (must be an integer)`
    );
  }

  const versionStr = getVersion();
  const versionStrMatch = /v(\d+)\.(\d+)/.exec(versionStr);
  if (!versionStrMatch) {
    // This is not something the user should handle
    throw new Error(
      `Unexpected KoLmafia version string: "${versionStr}". You may need to update the script.`
    );
  }

  const currentMajorVersion = Number(versionStrMatch[1]);
  const currentMinorVersion = Number(versionStrMatch[2]);

  // Based on net.sourceforge.kolmafia.textui.Parser.sinceException()
  if (
    currentMajorVersion < majorVersion ||
    (currentMajorVersion === majorVersion && currentMinorVersion < minorVersion)
  ) {
    throw new KolmafiaVersionError(
      `${getScriptName()} requires version ${majorVersion}.${minorVersion} of kolmafia or higher (current: ${currentMajorVersion}.${currentMinorVersion}). Up-to-date builds can be found at https://ci.kolmafia.us/.`
    );
  }
}

/**
 * Sends a Kmail to another player (usually the project maintainer) to
 * acknowledge that the current player is using the project.
 * This will send a message only once for the same "main" script.
 *
 * **This must be called inside the `main()` function of your script.**
 * Otherwise, it may fail to send a message.
 *
 * This behaves like the `script <name>;` and `notify <player>;` statements in
 * ASH, combined into a single function call.
 * @param projectName Name of the project, used in the Kmail message
 * @param username Player username
 */
export function notifyProjectMaintainer(
  projectName: string,
  username: string
): void {
  if (require.main === undefined) {
    throw new Error(
      'require.main is undefined.' +
        '\nnotifyProjectMaintainer() must be called inside the main() function.'
    );
  }

  const match = /^file:(\/.+\.[Jj][Ss])$/.exec(require.main.id);
  if (!match) {
    throw new Error(
      `Cannot determine the entrypoint script file for <${projectName}>.` +
        `\n(require.main.id === \`${require.main.id}\`)`
    );
  }
  const scriptFileToken = `<${match[1]}>`;

  if (!projectName) {
    throw new Error(
      `Missing script name. Report the problem to the project maintainer (${username}).`
    );
  }
  if (!username) {
    throw new Error(
      `Missing username for <${projectName}>. Report the problem to the project maintainer.`
    );
  }

  const NOTIFY_LIST_PROPERTY = 'previousNotifyList';
  const oldNotifyList = getProperty(NOTIFY_LIST_PROPERTY, true);
  if (!oldNotifyList.includes(scriptFileToken)) {
    print(`${projectName}: Notifying ${username}...`);
    kmail({
      recipent: username,
      message: `I have chosen to run <${projectName}>. Thank you for maintaining this project!`,
    });
    setProperty(NOTIFY_LIST_PROPERTY, oldNotifyList + scriptFileToken);
  }
}
