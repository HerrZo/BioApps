import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getNearbyMilestones, milestones } from './data.ts';

describe('getNearbyMilestones', () => {
  test('returns 3 milestones by default', () => {
    const result = getNearbyMilestones(12);
    assert.equal(result.length, 3);
  });

  test('returns the specified number of milestones', () => {
    const result = getNearbyMilestones(12, 5);
    assert.equal(result.length, 5);
  });

  test('returns milestones closest to the given time in hours', () => {
    // 0 hours -> Earth formation (timeHours: 0)
    const result = getNearbyMilestones(0, 1);
    assert.equal(result[0].id, 'earth-formation');
    assert.equal(result[0].timeHours, 0);
  });

  test('sorts milestones correctly by distance to given time', () => {
    // Find the closest milestones to 23 hours
    const targetTime = 23;
    const result = getNearbyMilestones(targetTime, 3);

    const dist0 = Math.abs(result[0].timeHours - targetTime);
    const dist1 = Math.abs(result[1].timeHours - targetTime);
    const dist2 = Math.abs(result[2].timeHours - targetTime);

    // Distances should be in ascending order
    assert.ok(dist0 <= dist1);
    assert.ok(dist1 <= dist2);
  });

  test('does not modify the original milestones array', () => {
    const originalLength = milestones.length;
    getNearbyMilestones(12);
    assert.equal(milestones.length, originalLength);
  });
});
