'use strict';

const fs = require('node:fs/promises');
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

function parseLineOutput(output) {
  return normalizeSerialList(
    output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

async function getFromSysBlock() {
  let devices;

  try {
    devices = await fs.readdir('/sys/block');
  } catch {
    return [];
  }

  const serials = [];
  for (const device of devices) {
    const path = `/sys/block/${device}/device/serial`;

    try {
      const value = await fs.readFile(path, 'utf8');
      serials.push(value);
    } catch {
      continue;
    }
  }

  return normalizeSerialList(serials);
}

async function getFromLsblk() {
  try {
    const output = await execFileAsync('lsblk', ['-dn', '-o', 'SERIAL']);
    return parseLineOutput(output);
  } catch {
    return [];
  }
}

async function getFromUdevadm() {
  let namesOutput;

  try {
    namesOutput = await execFileAsync('lsblk', ['-dn', '-o', 'NAME']);
  } catch {
    return [];
  }

  const names = namesOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const serials = [];
  for (const name of names) {
    try {
      const output = await execFileAsync('udevadm', ['info', '--query=property', `--name=/dev/${name}`]);
      const line = output
        .split(/\r?\n/)
        .find((item) => item.startsWith('ID_SERIAL_SHORT=') || item.startsWith('ID_SERIAL='));

      if (!line) {
        continue;
      }

      serials.push(line.split('=').slice(1).join('='));
    } catch {
      continue;
    }
  }

  return normalizeSerialList(serials);
}

async function getSerials() {
  const serials = await getFromSysBlock();
  if (serials.length) {
    return serials;
  }

  const lsblkSerials = await getFromLsblk();
  if (lsblkSerials.length) {
    return lsblkSerials;
  }

  const udevSerials = await getFromUdevadm();
  if (udevSerials.length) {
    return udevSerials;
  }

  throw new Error('No disk serial found');
}

module.exports = {
  getSerials,
  _parseLineOutput: parseLineOutput
};
