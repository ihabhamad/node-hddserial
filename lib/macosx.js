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
        disks = out.split(/(?:--\n--)/g);
        for (var i = disks.length - 1; i >= 0; i--) {
            disks[i] = disks[i].split(/(?:\r\n|\r|\n)/g);
            var info = [];
            for (var j = disks[i].length - 1; j >= 0; j--) {
                node = disks[i][j].trim().split(":").map(String);
                node[1] && (info[node[0]] = node[1].trim());
            }
            disksinfo.push(info);
        }
        var Serialnumbers = [];
        for (var i = disksinfo.length - 1; i >= 0; i--) {
            if (disksinfo[i]['Model'].indexOf('CD') === -1) {
                Serialnumbers.push(disksinfo[i]['Serial Number']);
            }
        }
        if (typeof index === 'function') {

            callback(false, Serialnumbers);
        } else {
            if (!isNaN(index) && Serialnumbers[index]) {
                callback(false, Serialnumbers[index]);
            } else {
                callback('error:the index must be a number', false)
            }

        }
    });

};