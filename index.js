'use strict';

const os = require('node:os');
const { normalizeSerial, normalizeSerialList } = require('./lib/utils');

const providers = {
  linux: require('./lib/providers/linux'),
  win32: require('./lib/providers/windows'),
  darwin: require('./lib/providers/macos'),
  sunos: require('./lib/providers/macos')
};

function withOptionalCallback(promise, callback) {
  if (typeof callback !== 'function') {
    return promise;
  }

  promise.then(
    (value) => callback(null, value),
    (error) => callback(error, null)
  );

  return undefined;
}

function getProvider(platform) {
  return providers[platform] || providers.linux;
}

function createApi(getSerials) {
  async function allAsync() {
    const serials = await getSerials();
    const normalized = normalizeSerialList(serials);

    if (!normalized.length) {
      throw new Error('No disk serial found');
    }

    return normalized;
  }

  const api = {
    all(callback) {
      return withOptionalCallback(allAsync(), callback);
    },

    first(callback) {
      return withOptionalCallback(this.one(0), callback);
    },

    one(index, callback) {
      if (typeof index === 'function') {
        return this.all(index);
      }

      const promise = (async () => {
        if (!Number.isInteger(index) || index < 0) {
          throw new TypeError('Index must be a non-negative integer');
        }

        const serials = await allAsync();
        const serial = serials[index];

        if (!serial) {
          throw new RangeError('Disk index out of range');
        }

        return serial;
      })();

      return withOptionalCallback(promise, callback);
    },

    check(serial, callback) {
      const promise = (async () => {
        if (typeof serial !== 'string') {
          throw new TypeError('Serial must be a string');
        }

        const normalizedInput = normalizeSerial(serial);
        if (!normalizedInput) {
          return false;
        }

        const serials = await allAsync();
        return serials.includes(normalizedInput);
      })();

      return withOptionalCallback(promise, callback);
    },

    isfirst(serial, callback) {
      const promise = (async () => {
        const first = await this.first();
        return normalizeSerial(serial) === first;
      })();

      return withOptionalCallback(promise, callback);
    }
  };

  return api;
}

const api = createApi(async () => {
  const provider = getProvider(os.platform());
  return provider.getSerials();
});

api._createApi = createApi;
api._utils = {
  normalizeSerial,
  normalizeSerialList
};

module.exports = api;
