import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatYearsAgo, getCurrentMilestone, milestones } from './data.ts';

describe('formatYearsAgo', () => {
  it('should format >= 1000 mya as Milliarden Jahren', () => {
    assert.strictEqual(formatYearsAgo(4500), '4.5 Milliarden Jahren');
    assert.strictEqual(formatYearsAgo(1000), '1.0 Milliarden Jahren');
    assert.strictEqual(formatYearsAgo(1234), '1.2 Milliarden Jahren');
  });

  it('should format >= 1 mya (< 1000 mya) as Millionen Jahren', () => {
    assert.strictEqual(formatYearsAgo(541), '541 Millionen Jahren');
    assert.strictEqual(formatYearsAgo(1), '1 Millionen Jahren');
    assert.strictEqual(formatYearsAgo(1.5), '2 Millionen Jahren'); // Math.round(1.5) = 2
  });

  it('should format years >= 1000 (< 1 mya) with thousand separators as Jahren', () => {
    assert.strictEqual(formatYearsAgo(0.5), '500.000 Jahren'); // 500,000 in de-DE is 500.000
    assert.strictEqual(formatYearsAgo(0.001), '1.000 Jahren');
    assert.strictEqual(formatYearsAgo(0.0025), '2.500 Jahren');
  });

  it('should format years > 0 (< 1000 years) as Jahren', () => {
    assert.strictEqual(formatYearsAgo(0.0005), '500 Jahren');
    assert.strictEqual(formatYearsAgo(0.000001), '1 Jahren');
    assert.strictEqual(formatYearsAgo(0.00001), '10 Jahren');
  });

  it('should format <= 0 as "der Gegenwart"', () => {
    assert.strictEqual(formatYearsAgo(0), 'der Gegenwart');
    assert.strictEqual(formatYearsAgo(-1), 'der Gegenwart');
  });
});

describe('getCurrentMilestone', () => {
  it('should return the first milestone when hours is 0', () => {
    const result = getCurrentMilestone(0);
    assert.strictEqual(result?.id, 'earth-formation');
  });

  it('should return the last milestone when hours is 24', () => {
    const result = getCurrentMilestone(24);
    assert.strictEqual(result?.id, 'homo-sapiens');
  });

  it('should return the exact milestone when hours matches perfectly', () => {
    for (const m of milestones) {
      const result = getCurrentMilestone(m.timeHours);
      assert.strictEqual(result?.id, m.id);
    }
  });

  it('should return the closest milestone when between two milestones', () => {
    if (milestones.length < 2) return;

    const m0 = milestones[0];
    const m1 = milestones[1];
    const midpoint = (m0.timeHours + m1.timeHours) / 2;

    // Slightly closer to m0
    assert.strictEqual(getCurrentMilestone(midpoint - 0.0001)?.id, m0.id);
    // Slightly closer to m1
    assert.strictEqual(getCurrentMilestone(midpoint + 0.0001)?.id, m1.id);
  });
});
