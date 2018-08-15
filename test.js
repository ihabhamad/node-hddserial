'use strict';

var hddSerialNumber = require('./index');

//return json
hddSerialNumber.all(function (error,data) {

    if(!error){
        console.log(JSON.stringify(data, null, 2));
    }

});
//return string
hddSerialNumber.one(0,function (error,data) {

    if(!error){
        console.log(data);
    }

});
//return string
hddSerialNumber.first(function (error,data) {

    if(!error){
        console.log(data);
    }

});


