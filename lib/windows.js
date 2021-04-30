var execFile = require('child_process').execFile;
module.exports = function (index, callback) {
    var regexRegex = /[\r\r\n]/g;
    var args = ["DiskDrive","where","size > 0", "Get", "SerialNumber,index"];
    var infos = [];
    if (typeof index === 'function') {
        callback = index;
    } else {
        if (typeof index === 'number') {
            args = ["DiskDrive","where", "index = " + index + " and size > 0", "Get", "SerialNumber,index"];
        } else {
            callback("the index must be a number", null);
            return;
        }
    }
    execFile("wmic",args, function (err, out) {
        if (err) {
            callback(err, null);
            return;
        }
        var hddinfos = out.replace("SerialNumber", "").replace("Index", "").replace(regexRegex, ",").trim().split(",").filter(function (value, index, self) {
            if (value.length !== 0) {
                return self.indexOf(value) === index;
            }
        });
        for(var i = 0;i < hddinfos.length;i++){
            var node = hddinfos[i].replace(/[\s]/,":").split(":").filter(function (value, index, self) {
                if (value.length !== 0) {
                    return self.indexOf(value) === index;
                }
            });
            infos[node[0]] = node[1];
        }
        if (infos.length > 0) {
            if (typeof index === 'function') {
                callback(null, infos);
            } else {
                callback(null, infos.toString());
            }
        } else {
            callback("no hdd serial found !!", null);
        }
    });
};
