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

## License

MIT
