const execFile = require('child_process').execFile;

const HEADER_SIZE = 2;

module.exports = function (index, callback) {
  let mustReturnArray = false;

  if (typeof index === 'function') {
    callback = index;
    index = 0;
    mustReturnArray = true;
  }

  if (typeof index !== 'number') {
    callback("the index must be a number", null);
    return;
  }

  execFile('powershell', ['-Command', 'Get-CimInstance -ClassName Win32_DiskDrive -Filter "index = ' + index + ' and size > 0" | Select -Property Index,SerialNumber'], function (err, out) {
    if (err) {
      callback(err, null);
      return;
    }

    const hddinfos = out.replace(/[\r\n]+/g, ",")
      .split(",")
      .filter((e) => e.length)
      .slice(HEADER_SIZE);

    const infos = [];
    for(let i = 0; i < hddinfos.length; i += 1){
      const node = hddinfos[i].replace(/\s+/g, ":").split(":").filter((e) => e.length);
      infos[node[0]] = node[1];
    }

    if (!infos.length) {
      callback("no hdd serial found !!", null);
      return;
    }

    if (mustReturnArray) {
      callback(null, infos);
    } else {
      callback(null, infos.toString());
    }
  });
}
