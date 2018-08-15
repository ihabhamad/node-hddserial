var exec = require('child_process').exec;
module.exports = function (index,callback) {
    var regexRegex = /[\r\n]*/g;
    var cmd = "wmic DiskDrive where \" Size > 0 and InterfaceType != 'USB' and MediaType Like 'Fixed%%'\" Get SerialNumber";
    var infos = [];
    if (typeof index === 'function') {
        callback = index;
    }else{
      cmd = "wmic DiskDrive where \"index = "+index+" and Size > 0 and InterfaceType != 'USB' and MediaType Like 'Fixed%%'\" Get SerialNumber"
    }
    exec(cmd, function (err, out) {
        if (err) {
            callback(err,false);
            return;
        }

        infos = out.replace(regexRegex,"").replace("SerialNumber","").trim().replace(/\s+/g, ',').split(",").map(String).filter(function (value, index, self) {
            if(value !== ''){
                return self.indexOf(value) === index;
            }

        });
        if(infos.length > 0){
            if (typeof index === 'function') {
                callback(false,infos);
            }else{
                callback(false,infos.toString());
            }
        }
    });
};
