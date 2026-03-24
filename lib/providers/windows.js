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

function parsePowerShellOutput(output) {
  return normalizeSerialList(
    output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

function parseWmicOutput(output) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^serialnumber$/i.test(line));

  return normalizeSerialList(lines);
}

async function getFromPowerShell() {
  const script = '$ErrorActionPreference="Stop"; Get-CimInstance -ClassName Win32_DiskDrive | Where-Object { $_.Size -gt 0 -and $_.SerialNumber } | Sort-Object -Property Index | Select-Object -ExpandProperty SerialNumber';

  const output = await execFileAsync('powershell.exe', [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    script
  ]);

  return parsePowerShellOutput(output);
}

async function getFromWmic() {
  const output = await execFileAsync('wmic', ['diskdrive', 'where', 'size > 0', 'get', 'SerialNumber']);
  return parseWmicOutput(output);
}

async function getSerials() {
  try {
    const serials = await getFromPowerShell();
    if (serials.length) {
      return serials;
    }
  } catch {
  }

  try {
    const serials = await getFromWmic();
    if (serials.length) {
      return serials;
    }
  } catch {
  }

  throw new Error('No disk serial found');
}

module.exports = {
  getSerials,
  _parsePowerShellOutput: parsePowerShellOutput,
  _parseWmicOutput: parseWmicOutput
};
