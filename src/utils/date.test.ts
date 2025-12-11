import assert from 'node:assert';
import { suite, test, mock, beforeEach } from "node:test"
import {relTime} from "./date.ts"

const nowTime = 475322400000;
const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;

suite('relTime', () => {
  test('simple time', (context) => {
    context.mock.timers.enable({
      apis: ["Date"],
      now: nowTime
    });

    assert.equal(Date.now(), nowTime, context.fullName)
  });

  test('now', (context) => {
    context.mock.timers.enable({
      apis: ["Date"],
      now: nowTime
    });

    const actual = relTime(`${nowTime}`);
    const expected = 'now'
    assert.equal(actual, 'now', context.fullName);
  })
  suite('future', () => {
    test('ms', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime + 0.5*s}`);
      assert.equal(actual, 'in 500ms', context.fullName);
    })

    test('s', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime + 5*s}`);
      assert.equal(actual, 'in 5s', context.fullName);
    })

    test('m', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime + 2*m}`);
      assert.equal(actual, 'in 2m', context.fullName);
    });

    test('h', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime + 4*h}`);
      assert.equal(actual, 'in 4h', context.fullName);
    });

    test('multiple', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime + 4*h + 2*m + 30*s}`);
      assert.equal(actual, 'in 4h 2m and 30s', context.fullName);
    });

    test('multiple (removes ms)', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime + 4*h + 2*m + 30*s + 0.5*s}`);
      assert.equal(actual, 'in 4h 2m and 30s', context.fullName);
    });
  });
  suite('past', () => {
    test('ms', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime - 0.5*s}`);
      assert.equal(actual, '500ms ago', context.fullName);
    })

    test('s', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime - 5*s}`);
      assert.equal(actual, '5s ago', context.fullName);
    })

    test('m', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime - 2*m}`);
      assert.equal(actual, '2m ago', context.fullName);
    });

    test('h', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime - 4*h}`);
      assert.equal(actual, '4h ago', context.fullName);
    });

    test('multiple', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime - (4*h + 2*m + 30*s)}`);
      assert.equal(actual, '4h 2m and 30s ago', context.fullName);
    });

    test('multiple (removes ms)', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });

      const actual = relTime(`${nowTime - (4*h + 2*m + 30*s + 0.5*s)}`);
      assert.equal(actual, '4h 2m and 30s ago', context.fullName);
    });
  });
  suite('overflow', () => {
    test('simple', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });
      const actual = relTime(`${nowTime + 52 * h + 32*m + 18 * s}`);
      assert.equal(actual, 'in 2d 4h 32m and 18s', context.fullName);
    });

    test('no days', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });
      const actual = relTime(`${nowTime + 52 * h + 32*m + 18 * s}`, {
        days: false
      });
      assert.equal(actual, 'in 52h 32m and 18s', context.fullName);
    });

    test('no days and no hours', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });
      const actual = relTime(`${nowTime + 52 * h + 32*m + 18 * s}`, {
        days: false,
        hours: false
      });
      assert.equal(actual, `in 3152m and 18s`, context.fullName);
    });

    test('no days and no hours and no seconds', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });
      const actual = relTime(`${nowTime + 52 * h + 32*m + 18 * s}`, {
        days: false,
        hours: false,
        seconds: false
      });
      assert.equal(actual, `in 3152m`, context.fullName);
    });

    test('everything', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });
      const actual = relTime(`${nowTime + 52 * h + 32*m + 18.5 * s}`, {
        millis: true,
        seconds: true
      });
      assert.equal(actual, `in 2d 4h 32m 18s and 500ms`, context.fullName);
    });

    test.only('disable just seconds', (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: nowTime
      });
      const actual = relTime(`${nowTime + 52 * h + 32*m + 18.5 * s}`, {
        seconds: false
      });
      assert.equal(actual, `in 2d 4h and 32m`, context.fullName);
    });
  })
});