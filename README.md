# hddserial

![npm](https://img.shields.io/npm/v/hddserial)
![node](https://img.shields.io/node/v/hddserial)

Retrieve physical disk serial numbers on Linux, Windows, and macOS.

This package is intentionally focused on storage serial retrieval only.
It does not expose CPU IDs, MAC addresses, motherboard identifiers, or machine UUIDs.

## Requirements

- Node.js >= 18

## Install

```bash
npm install hddserial
```

## Usage (Promise)

```js
const hddserial = require('hddserial');

(async () => {
  const serial = await hddserial.first();
  console.log(serial);
})();
```

## Usage (Callback)

```js
const hddserial = require('hddserial');

hddserial.first((err, serial) => {
  if (err) return console.error(err);
  
  console.log(serial);
});
```

## Methods

- `first()` -> returns first disk serial
- `all()` -> returns all detected serials
- `one(index)` -> returns serial at index
- `check(serial)` -> checks if serial exists

## Behavior Notes

- Serial values are normalized to reduce OS-specific formatting noise.
- Results are deduplicated and returned in stable order.
- `one(index)` uses zero-based indexing.
- `check(serial)` compares normalized serial values.

## Limitations

- Disk serial availability depends on OS and permissions
- Some environments (Docker, VM, cloud) may not expose real disk serials
- macOS and certain SSDs may return limited or no serial information

## Supported Platforms

- Linux
- Windows
- macOS

## Cross-Platform Validation

`hddserial` is validated in CI and real environments to ensure reliability across operating systems.

### CI (GitHub Actions)

- Operating systems: Linux (`ubuntu-latest`), Windows (`windows-latest`), macOS (`macos-latest`)
- Node.js versions: 18, 20, 22
- Checks: `npm ci`, package entry validation, `npm test`, runtime smoke test (no crash), `npm pack --dry-run`

All CI matrix jobs are passing successfully.

### Real Environment Testing

- Windows 11 (physical machine): successfully retrieves disk serials and API behavior is verified
- Ubuntu 24.04 (Proxmox VM): installs and runs correctly, API executes without errors

### Limitations and Notes

- Disk serial availability depends on operating system permissions, hardware type, storage drivers, and virtualization environment
- Virtualized environments (for example Proxmox, KVM, Docker) may not expose real disk serials
- The library returns available disk/storage serials reported by the operating system

### Testing Summary

| Environment | Result | Notes |
| --- | --- | --- |
| Windows 11 (Physical) | ✅ | Real disk serial detected |
| Ubuntu 24.04 (VM) | ✅ | Tested successfully |
| Linux (CI) | ✅ | Passed |
| Windows (CI) | ✅ | Passed |
| macOS (CI) | ✅ | Passed |

### CI Status

[![CI](https://github.com/ihabhamad/node-hddserial/actions/workflows/ci.yml/badge.svg)](https://github.com/ihabhamad/node-hddserial/actions/workflows/ci.yml)

## License

MIT
