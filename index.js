/* jshint node: true */
'use strict';

var os = require('os');

var lib = {};

var _getSerialNumber;
switch (os.platform()) {

    case 'win32':
        _getSerialNumber = require('./lib/windows/index');
        break;

    case 'linux':
        _getSerialNumber = require('./lib/linux.js');
        break;

    case 'darwin':
    case 'sunos':
        _getSerialNumber = require('./lib/macosx.js');
        break;

    default:
        console.warn("node-HddSerialNumber: Unkown os.platform(), defaulting to `linux'.");
        _getSerialNumber = require('./lib/linux.js');
        break;

}

lib.first = function (callback) {

    if (typeof callback === 'function') {
        _getSerialNumber(0, callback);
    }

    return null;
};
lib.all = function (callback) {

    if (typeof callback === 'function') {
        _getSerialNumber(callback);
    }

    return null;
};
lib.one = function (index, callback) {

    if (typeof index === 'function') {
        _getSerialNumber(index);
    } else {
        _getSerialNumber(index, callback);
    }

};

lib.check = function(SerialNumber,callback){
    if (typeof callback === 'function' && typeof SerialNumber === "string") {
        _getSerialNumber(function (error, Serials) {
            if (error) {
                callback(error, null);
            } else {
                if (Serials.indexOf(SerialNumber) !== -1) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            }
        });

    }else{
        return null;
    }
};
lib.isfirst = function (SerialNumber, callback) {
    if (typeof callback === 'function' && typeof SerialNumber === "string") {
        _getSerialNumber(0, function (error, Serial) {
            if (error) {
                callback(error, null);
            } else {
                if (Serial === SerialNumber) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            }
        });

    }else{
        return null;
    }
};

module.exports = lib;
