const os = require('os');

/**
 * Tell if PowerShell 3 is available based on Windows version
 *
 * Note: 6.* is Windows 7
 * Note: PowerShell 3 is natively available since Windows 8
 *
 */
function hasPowerShell3 () {
  const major = parseInt(os.release().split('.')[0], 10)

  return major > 6
}

module.exports = (index, callback) => {
  if (hasPowerShell3()) {
    require('./getCimInstance')(index, callback);
  } else {
    require('./wmic')(index, callback);
  }
};
