var exec = require('child_process').exec;
module.exports = function (index, callback) {
    if (typeof index === 'function') {
        callback = index;
    }
    exec("system_profiler SPSerialATADataType | grep -B3 -A3 'Serial Number'", function (err, out) {
        if (err) {
            callback(err, false);
            return;
        }
        var disksinfo = [];
        var disks = out.split(/(?:--\n--)/g);
        for (var i = disks.length - 1; i >= 0; i--) {
            disks[i] = disks[i].split(/(?:\r\n|\r|\n)/g);
            var info = [];
            for (var j = disks[i].length - 1; j >= 0; j--) {
                var node = disks[i][j].trim().split(":").map(String);
                node[1] && (info[node[0]] = node[1].trim());
            }
            disksinfo.push(info);
        }
        var Serialnumbers = [];
        for (var x = 0; x < disksinfo.length; x++) {
            if (disksinfo[x]['Model'].indexOf('CD') === -1) {
                Serialnumbers.push(disksinfo[x]['Serial Number']);
            }
        }
        if (Serialnumbers.length > 0) {


            if (typeof index === 'function') {

                callback(null, Serialnumbers);
            } else {
                if (!isNaN(index) && Serialnumbers[index]) {
                    callback(null, Serialnumbers[index]);
                } else {
                    callback('the index must be a number', false)
                }

            }
        } else {
            callback("no hdd serial found !!", null);
        }
    });

};