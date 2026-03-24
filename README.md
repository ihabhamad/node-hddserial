# hddserial

Retrieve physical disk serial numbers on Linux, Windows, and macOS.

This package is intentionally focused on storage serial retrieval only.
It does not expose CPU IDs, MAC addresses, motherboard identifiers, or machine UUIDs.

## Install

```bash
npm install hddserial
```

## API

- `first()` -> `Promise<string>`
- `all()` -> `Promise<string[]>`
- `one(index)` -> `Promise<string>`
- `check(serial)` -> `Promise<boolean>`

All methods also support Node-style callbacks for backward compatibility.

### Promise usage

```js
const hddserial = require('hddserial');

async function run() {
  const first = await hddserial.first();
  const all = await hddserial.all();
  const second = await hddserial.one(1);
  const exists = await hddserial.check(first);

  console.log({ first, all, second, exists });
}

run().catch(console.error);
```

### Callback usage

```js
const hddserial = require('hddserial');

hddserial.first((err, serial) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(serial);
});
```

## Behavior Notes

- Serial values are normalized to reduce OS-specific formatting noise.
- Results are deduplicated and returned in stable order.
- `one(index)` uses zero-based indexing.
- `check(serial)` compares normalized serial values.

## Supported Platforms

- Linux
- Windows
- macOS

## License

MIT
