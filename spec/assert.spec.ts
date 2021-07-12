import * as assert from '../src/assert';

describe('assert.ok()', () => {
  it('should not throw on truthy values', () => {
    expect(() => assert.ok(true)).not.toThrow();
    expect(() => assert.ok(1)).not.toThrow();
    expect(() => assert.ok({})).not.toThrow();
    expect(() => assert.ok([])).not.toThrow();
    expect(() => assert.ok(/foo/)).not.toThrow();
  });

  it('should throw on falsy values', () => {
    expect(() => assert.ok(false)).toThrowError(assert.AssertionError);
    expect(() => assert.ok(0)).toThrowError(assert.AssertionError);
    expect(() => assert.ok(undefined)).toThrowError(assert.AssertionError);
    expect(() => assert.ok(null)).toThrowError(assert.AssertionError);
    expect(() => assert.ok(NaN)).toThrowError(assert.AssertionError);
  });
});

describe('assert.fail()', () => {
  it('should throw', () => {
    expect(() => assert.fail()).toThrowError(assert.AssertionError);
    expect(() => assert.fail('foo bar')).toThrowError(
      assert.AssertionError,
      'foo bar'
    );
  });
});

describe('assert.equal()', () => {
  it('should not throw if a === b', () => {
    expect(() => assert.equal('foo', 'foo')).not.toThrow();
  });

  it('should throw if a !== b', () => {
    expect(() => assert.equal(1, 2)).toThrowError(assert.AssertionError);
    expect(() => assert.equal(NaN, NaN)).toThrowError(assert.AssertionError);
  });

  it('should compare shallowly', () => {
    expect(() => assert.equal({}, {})).toThrowError(assert.AssertionError);
    expect(() => assert.equal([1, 2, 3], [1, 2, 3])).toThrowError(
      assert.AssertionError
    );
  });
});

describe('assert.notEqual()', () => {
  it('should not throw if a !== b', () => {
    expect(() => assert.notEqual(100, 200)).not.toThrow();
    expect(() => assert.notEqual(NaN, NaN)).not.toThrow();
  });

  it('should throw if a === b', () => {
    expect(() => assert.notEqual('bar', 'bar')).toThrowError(
      assert.AssertionError
    );
  });

  it('should compare shallowly', () => {
    expect(() => assert.notEqual({}, {})).not.toThrow();
    expect(() => assert.notEqual([1, 2, 3], [1, 2, 3])).not.toThrow();
  });
});

describe('assert.isAtLeast()', () => {
  it('should not throw if a >= b', () => {
    expect(() => assert.isAtLeast(15, 15)).not.toThrow();
    expect(() => assert.isAtLeast(0, -1)).not.toThrow();
    expect(() => assert.isAtLeast('Z', 'Z')).not.toThrow();
    expect(() => assert.isAtLeast('Z', 'Y')).not.toThrow();
  });

  it('should throw if a < b', () => {
    expect(() => assert.isAtLeast(10, 20)).toThrowError(assert.AssertionError);
    expect(() => assert.isAtLeast('Y', 'Z')).toThrowError(
      assert.AssertionError
    );
  });

  it('should throw if two values cannot be compared', () => {
    expect(() => assert.isAtLeast(1, NaN)).toThrowError(assert.AssertionError);
  });
});

describe('assert.isAtMost()', () => {
  it('should not throw if a <= b', () => {
    expect(() => assert.isAtMost(0, 0)).not.toThrow();
    expect(() => assert.isAtMost(-1, 0)).not.toThrow();
    expect(() => assert.isAtMost('A', 'A')).not.toThrow();
    expect(() => assert.isAtMost('A', 'B')).not.toThrow();
  });

  it('should throw if a > b', () => {
    expect(() => assert.isAtMost(99, 88)).toThrowError(assert.AssertionError);
    expect(() => assert.isAtMost('B', 'A')).toThrowError(assert.AssertionError);
  });

  it('should throw if two values cannot be compared', () => {
    expect(() => assert.isAtMost(1, NaN)).toThrowError(assert.AssertionError);
  });
});

describe('assert.isAbove()', () => {
  it('should not throw if a > b', () => {
    expect(() => assert.isAbove(0, -1)).not.toThrow();
    expect(() => assert.isAbove('z', 'y')).not.toThrow();
  });

  it('should throw if a <= b', () => {
    expect(() => assert.isAbove(40, 50)).toThrowError(assert.AssertionError);
    expect(() => assert.isAbove(35, 35)).toThrowError(assert.AssertionError);
    expect(() => assert.isAbove('y', 'y')).toThrowError(assert.AssertionError);
    expect(() => assert.isAbove('x', 'y')).toThrowError(assert.AssertionError);
  });

  it('should throw if two values cannot be compared', () => {
    expect(() => assert.isAbove(1, NaN)).toThrowError(assert.AssertionError);
  });
});

describe('assert.isBelow()', () => {
  it('should not throw if a < b', () => {
    expect(() => assert.isBelow(-1, 0)).not.toThrow();
    expect(() => assert.isBelow('a', 'b')).not.toThrow();
  });

  it('should throw if a >= b', () => {
    expect(() => assert.isBelow(19, 7)).toThrowError(assert.AssertionError);
    expect(() => assert.isBelow(12, 12)).toThrowError(assert.AssertionError);
    expect(() => assert.isBelow('b', 'b')).toThrowError(assert.AssertionError);
    expect(() => assert.isBelow('c', 'b')).toThrowError(assert.AssertionError);
  });

  it('should throw if two values cannot be compared', () => {
    expect(() => assert.isBelow(1, NaN)).toThrowError(assert.AssertionError);
  });
});
