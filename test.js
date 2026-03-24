'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const hddserial = require('./index');

test('normalize helpers clean and deduplicate serial values', () => {
  assert.equal(hddserial._utils.normalizeSerial(' " ab c-01 " '), 'ABC-01');

  assert.deepEqual(
    hddserial._utils.normalizeSerialList([' a1 ', 'A1', '', 'b2']),
    ['A1', 'B2']
  );
});

test('promise API returns normalized values', async () => {
  const api = hddserial._createApi(async () => ['  abc  ', 'ABC', 'def']);

  assert.deepEqual(await api.all(), ['ABC', 'DEF']);
  assert.equal(await api.first(), 'ABC');
  assert.equal(await api.one(1), 'DEF');
  assert.equal(await api.check(' d e f '), true);
});

test('one(index) validates index', async () => {
  const api = hddserial._createApi(async () => ['X1']);

  await assert.rejects(api.one(-1), /Index must be a non-negative integer/);
  await assert.rejects(api.one(4), /Disk index out of range/);
});

test('callback API remains supported', async () => {
  const api = hddserial._createApi(async () => ['A1', 'B2']);

  await new Promise((resolve, reject) => {
    api.first((err, serial) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        assert.equal(serial, 'A1');
        resolve();
      } catch (assertionError) {
        reject(assertionError);
      }
    });
  });

  await new Promise((resolve, reject) => {
    api.one((err, serials) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        assert.deepEqual(serials, ['A1', 'B2']);
        resolve();
      } catch (assertionError) {
        reject(assertionError);
      }
    });
  });
});
