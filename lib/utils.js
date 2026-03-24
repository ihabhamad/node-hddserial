'use strict';

function normalizeSerial(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\0/g, '')
    .trim()
    .replace(/^['"`]+|['"`]+$/g, '')
    .replace(/\s+/g, '')
    .toUpperCase();
}

function normalizeSerialList(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set();
  const serials = [];

  for (const value of values) {
    const normalized = normalizeSerial(value);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    serials.push(normalized);
  }

  return serials;
}

module.exports = {
  normalizeSerial,
  normalizeSerialList
};
