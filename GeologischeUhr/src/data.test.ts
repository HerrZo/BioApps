import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { hoursToYearsAgo } from './data.ts';

describe('hoursToYearsAgo', () => {
  it('should return 4600 for 0 hours (start of Earth)', () => {
    assert.equal(hoursToYearsAgo(0), 4600);
  });

  it('should return 0 for 24 hours (present day)', () => {
    assert.equal(hoursToYearsAgo(24), 0);
  });

  it('should return 2300 for 12 hours (midpoint)', () => {
    assert.equal(hoursToYearsAgo(12), 2300);
  });

  it('should return 3450 for 6 hours', () => {
    assert.ok(Math.abs(hoursToYearsAgo(6) - 3450) < 0.00001);
  });

  it('should return 1150 for 18 hours', () => {
    assert.ok(Math.abs(hoursToYearsAgo(18) - 1150) < 0.00001);
  });

  it('should handle fractional hours correctly', () => {
    // 24 hours = 4600 mya -> 1 hour = 191.666... mya
    // 23 hours = 24 - 23 = 1 hour left -> 1 * 4600 / 24 = 191.666...
    assert.ok(Math.abs(hoursToYearsAgo(23) - 191.66666666666666) < 0.00001);
  });
});
