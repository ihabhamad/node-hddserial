var exec = require('child_process').exec;

module.exports = function (index,callback) {
    var infos = [];
    if (typeof index === 'function') {
        callback = index;
    }
    exec("ls /dev/sd*[a-z]  | cut  -d \"/\" -f3", function (err, hddout) {
        if (err) {
            callback(err,false);
            return;
        }
     var hddarray = hddout.trim().replace(/\s+/g, ',').split(",").map(String).filter(function (value, index, self) {
         return self.indexOf(value) === index;
     });
        if (typeof index === 'function') {
            for(var i = 0;i < hddarray.length;i++){
                exec("udevadm info --query=all --name=/dev/"+hddarray[i]+" | grep ID_SERIAL_SHORT", function (err, Serialnumber) {
                    if (err) {
                        callback(err,false);
                        return;
                    }
                    infos.push(Serialnumber.replace("E:","").replace("ID_SERIAL_SHORT=","").trim());
                    if(infos.length === hddarray.length){
                        infos = infos.filter(function (value, index, self) {
                            return self.indexOf(value) === index;
                        });
                        callback(false,infos);
                    }
                });
            }
        }else{
            exec("udevadm info --query=all --name=/dev/"+hddarray[index]+" | grep ID_SERIAL_SHORT", function (err, Serialnumber) {
                if (err) {
                    callback(err,false);
                    return;
                }
                callback(false,Serialnumber.replace("E:","").replace("ID_SERIAL_SHORT=","").trim().toString());
            });
        }
    });
};
