/**
 * @file Simple assertion tools.
 * Note: This module does not rely on KoLmafia's JavaScript API, and can be used
 * in any environment.
 */

/**
 * Thrown when an assertion fails.
 */
export class AssertionError extends Error {
  constructor(message = 'Assertion failure') {
    super(message);
    this.message = message;
  }
}

AssertionError.prototype.name = 'AssertionError';

/**
 * Assert that the condition is truthy.
 * @param cond Condition to check
 * @param message Assertion message
 */
export function ok(cond: unknown, message?: string): asserts cond {
  if (!cond) {
    throw new AssertionError(message ?? `Condition is ${cond}`);
  }
}

/**
 * Always throw an exception.
 * @param message Assertion message
 */
export function fail(message = 'Assertion failure'): never {
  throw new AssertionError(message);
}

/**
 * Assert that the two values are strictly equal (`===`).
 * @param actual Value to check
 * @param expected Expected value
 * @param message Assertion message
 */
export function equal<T>(
  actual: unknown,
  expected: T,
  message?: string
): asserts actual is T {
  if (actual !== expected) {
    throw new AssertionError(message ?? `Expected ${actual} === ${expected}`);
  }
}

/**
 * Assert that the two values are strictly inequal (`!==`).
 * @param actual Value to check
 * @param expected Expected value
 * @param message Assertion message
 */
export function notEqual(
  actual: unknown,
  expected: unknown,
  message?: string
): void {
  if (actual === expected) {
    throw new AssertionError(message ?? `Expected ${actual} !== ${expected}`);
  }
}

/**
 * Assert that the first value is same or greater than (`>=`) the second value.
 * @param value Value to check
 * @param atLeast Value to compare with
 * @param message Assertion message
 */
export function isAtLeast<T>(value: T, atLeast: T, message?: string): void {
  if (!(value >= atLeast)) {
    throw new AssertionError(message ?? `Expected ${value} >= ${atLeast}`);
  }
}

/**
 * Assert that the first value is same or less than (`<=`) the second value.
 * @param value Value to check
 * @param atMost Value to compare with
 * @param message Assertion message
 */
export function isAtMost<T>(value: T, atMost: T, message?: string): void {
  if (!(value <= atMost)) {
    throw new AssertionError(message ?? `Expected ${value} <= ${atMost}`);
  }
}

/**
 * Assert that the first value is greater than (`>`) the second value.
 * @param value Value to check
 * @param above Value to compare with
 * @param message Assertion message
 */
export function isAbove<T>(value: T, above: T, message?: string): void {
  if (!(value > above)) {
    throw new AssertionError(message ?? `Expected ${value} > ${above}`);
  }
}

/**
 * Assert that the first value is less than (`<`) the second value.
 * @param value Value to check
 * @param below Value to compare with
 * @param message Assertion message
 */
export function isBelow<T>(value: T, below: T, message?: string): void {
  if (!(value < below)) {
    throw new AssertionError(message ?? `Expected ${value} < ${below}`);
  }
}
