'use strict';

var hddSerialNumber = require('./index');

//return array
hddSerialNumber.all(function (error,data) {

    if(!error){
        console.log(data);
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


