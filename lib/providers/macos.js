'use strict';

const { execFile } = require('node:child_process');
const { normalizeSerialList } = require('../utils');

function execFileAsync(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { windowsHide: true }, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(String(stdout));
    });
  });
}

function collectSerialValues(node, output) {
  if (!node) {
    return;
  }

  if (Array.isArray(node)) {
    for (const value of node) {
      collectSerialValues(value, output);
    }
    return;
  }

  if (typeof node !== 'object') {
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string' && key.toLowerCase().includes('serial')) {
      output.push(value);
    }

    collectSerialValues(value, output);
  }
}

function parseSystemProfilerJson(output) {
  const parsed = JSON.parse(output);
  const serials = [];
  collectSerialValues(parsed, serials);
  return normalizeSerialList(serials);
}

function parseSystemProfilerText(output) {
  const matches = output.match(/Serial Number:\s*(.+)$/gim) || [];
  const serials = matches.map((line) => line.split(':').slice(1).join(':'));
  return normalizeSerialList(serials);
}

async function getFromJson() {
  const output = await execFileAsync('system_profiler', ['SPNVMeDataType', 'SPSerialATADataType', '-json']);
  return parseSystemProfilerJson(output);
}

async function getFromText() {
  const output = await execFileAsync('system_profiler', ['SPNVMeDataType', 'SPSerialATADataType']);
  return parseSystemProfilerText(output);
}

async function getSerials() {
  try {
    const serials = await getFromJson();
    if (serials.length) {
      return serials;
    }
  } catch {
  }

  try {
    const serials = await getFromText();
    if (serials.length) {
      return serials;
    }
  } catch {
  }

  throw new Error('No disk serial found');
}

module.exports = {
  getSerials,
  _parseSystemProfilerJson: parseSystemProfilerJson,
  _parseSystemProfilerText: parseSystemProfilerText
};
