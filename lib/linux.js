var exec = require('child_process').exec;
module.exports = function (index,callback) {
    var infos = [];
    if (typeof index === 'function') {
        callback = index;
    }
    exec("ls /dev/sd*[a-z]  | cut  -d \"/\" -f3", function (err, hddout) {
        if (err) {
            callback(err,null);
            return;
        }
     var hddarray = hddout.trim().replace(/\s+/g, ',').split(",").map(String).filter(function (value, index, self) {
         return self.indexOf(value) === index;
     });
        if (typeof index === 'function') {
            for(var i = 0;i < hddarray.length;i++){
                exec("udevadm info --query=all --name=/dev/"+hddarray[i]+" | grep ID_SERIAL_SHORT", function (err, SerialNumber) {
                    if (err) {
                        callback(err,null);
                        return;
                    }
                    infos[this.i] = SerialNumber.replace("E:","").replace("ID_SERIAL_SHORT=","").trim();
                    if(infos.length === hddarray.length){
                        infos = infos.filter(function (value, index, self) {
                            if (value.length !== 0) {
                                return self.indexOf(value) === index;
                            }
                        });
                         callback(null,infos);
                    }
                }.bind({i: i}));
            }
        }else{
            if(typeof index === "number") {
                if(hddarray[index]  !== undefined) {
                    exec("udevadm info --query=all --name=/dev/" + hddarray[index] + " | grep ID_SERIAL_SHORT", function (err, SerialNumber) {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        callback(null, SerialNumber.replace("E:", "").replace("ID_SERIAL_SHORT=", "").trim().toString());
                    });
                }else{
                    callback("no hdd serial found !!",null);
                }
            }else{
                callback("the index must be a number", null);
            }
        }
    });
};
