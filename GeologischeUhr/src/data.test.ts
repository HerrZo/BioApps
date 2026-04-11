import test from 'node:test';
import assert from 'node:assert';
import { getEonForHours, eons } from './data.ts';

test('getEonForHours returns the correct eon for various times', async (t) => {
  await t.test('Hadaikum boundaries', () => {
    // Hadaikum starts at 0
    assert.strictEqual(getEonForHours(0).name, 'Hadaikum');
    // Hadaikum middle
    assert.strictEqual(getEonForHours(1).name, 'Hadaikum');
    // Hadaikum near end
    assert.strictEqual(getEonForHours(3.1).name, 'Hadaikum');
  });

  await t.test('Archaikum boundaries', () => {
    const startArchaikum = eons.find(e => e.name === 'Archaikum')?.startHours ?? 3.1304;
    assert.strictEqual(getEonForHours(startArchaikum).name, 'Archaikum');
    assert.strictEqual(getEonForHours(startArchaikum + 1).name, 'Archaikum');
  });

  await t.test('Proterozoikum boundaries', () => {
    const startProtero = eons.find(e => e.name === 'Proterozoikum')?.startHours ?? 10.9565;
    assert.strictEqual(getEonForHours(startProtero).name, 'Proterozoikum');
    assert.strictEqual(getEonForHours(startProtero + 5).name, 'Proterozoikum');
  });

  await t.test('Phanerozoikum boundaries', () => {
    const startPhanero = eons.find(e => e.name === 'Phanerozoikum')?.startHours ?? 21.1773;
    assert.strictEqual(getEonForHours(startPhanero).name, 'Phanerozoikum');
    assert.strictEqual(getEonForHours(23.99).name, 'Phanerozoikum');
  });

  await t.test('Fallback behavior', () => {
    // 24.0 should fallback to Phanerozoikum (last eon) as per implementation `?? eons[eons.length - 1]`
    assert.strictEqual(getEonForHours(24).name, 'Phanerozoikum');
    // Values out of range
    assert.strictEqual(getEonForHours(-1).name, 'Phanerozoikum');
    assert.strictEqual(getEonForHours(25).name, 'Phanerozoikum');
  });
});
