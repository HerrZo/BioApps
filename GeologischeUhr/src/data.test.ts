import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getCurrentMilestone, milestones } from './data.ts';

describe('getCurrentMilestone', () => {
  test('returns exactly matching milestone at hour 0', () => {
    const milestone = getCurrentMilestone(0);
    assert.ok(milestone);
    assert.strictEqual(milestone.id, 'earth-formation');
  });

  test('returns closest milestone when given hours in between', () => {
    // earth-formation is at 0h
    // moon-formation is at ~0.5217h (24 - 4500 * 24 / 4600 = 0.521739...)

    // At 0.2h, distance to earth-formation is 0.2
    // distance to moon-formation is ~0.32
    // Expected: earth-formation
    let milestone = getCurrentMilestone(0.2);
    assert.ok(milestone);
    assert.strictEqual(milestone.id, 'earth-formation');

    // At 0.4h, distance to moon-formation is ~0.12
    // distance to earth-formation is 0.4
    // Expected: moon-formation
    milestone = getCurrentMilestone(0.4);
    assert.ok(milestone);
    assert.strictEqual(milestone.id, 'moon-formation');
  });

  test('returns last milestone at hour 24', () => {
    const milestone = getCurrentMilestone(24);
    assert.ok(milestone);
    assert.strictEqual(milestone.id, 'homo-sapiens');
  });

  test('returns closest milestone for out-of-bounds negative hours', () => {
    const milestone = getCurrentMilestone(-5);
    assert.ok(milestone);
    assert.strictEqual(milestone.id, 'earth-formation');
  });

  test('returns closest milestone for out-of-bounds large positive hours', () => {
    const milestone = getCurrentMilestone(100);
    assert.ok(milestone);
    assert.strictEqual(milestone.id, 'homo-sapiens');
  });
});
