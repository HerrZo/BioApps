import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { hoursToTimeString } from './data.ts';

describe('hoursToTimeString', () => {
  it('formats zero hours correctly', () => {
    assert.equal(hoursToTimeString(0), '00:00:00');
  });

  it('formats whole hours correctly', () => {
    assert.equal(hoursToTimeString(5), '05:00:00');
    assert.equal(hoursToTimeString(12), '12:00:00');
    assert.equal(hoursToTimeString(24), '24:00:00');
  });

  it('formats hours with half-hour fractions correctly', () => {
    assert.equal(hoursToTimeString(1.5), '01:30:00');
    assert.equal(hoursToTimeString(10.5), '10:30:00');
  });

  it('formats hours with quarter-hour fractions correctly', () => {
    assert.equal(hoursToTimeString(2.25), '02:15:00');
    assert.equal(hoursToTimeString(4.75), '04:45:00');
  });

  it('formats hours with minutes and seconds correctly', () => {
    // 1 hour, 1 minute, 1 second = 1 + 1/60 + 1/3600
    assert.equal(hoursToTimeString(1 + 1/60 + 1/3600), '01:01:01');

    // 1 hour, 2 minute, 3 second = 1 + 2/60 + 3/3600
    assert.equal(hoursToTimeString(1 + 2/60 + 3/3600), '01:02:03');

    // 23 hours, 59 minutes, 59 seconds = 23 + 59/60 + 59/3600
    assert.equal(hoursToTimeString(23 + 59/60 + 59/3600), '23:59:59');
  });

  it('handles small fractional values', () => {
    // Just 1 second = 1 / 3600 hours
    assert.equal(hoursToTimeString(1 / 3600), '00:00:01');
  });

  it('handles negative numbers if applicable or behaves deterministically', () => {
    // Negative times format consistently by placing a minus sign.
    // -1.5 hours corresponds to -01:30:00.
    assert.equal(hoursToTimeString(-1.5), '-01:30:00');
  });
});
