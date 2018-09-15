'use strict';

var hddSerialNumber = require('./index');

//return array | object
hddSerialNumber.all(function (error,SerialNumbers) {

    if(error){
      throw error;
    }else{
       if(typeof SerialNumbers !== "object" && SerialNumbers.length > 0){
           throw new Error("error data type or be not empty");
       }
        console.log(SerialNumbers);
    }

});
//return string
hddSerialNumber.one(0,function (error,SerialNumber) {
    if(error){
        throw new Error(error);
    }else{
        if(typeof SerialNumber !== "string" && SerialNumber.length > 0){
            throw new Error("error data type or be not empty");
        }
        console.log(SerialNumber);
    }

});

//return string
hddSerialNumber.first(function (error,SerialNumber) {

    if(error){
        throw new Error(error);
    }else{
        if(typeof SerialNumber !== "string" && SerialNumber.length > 0){
            throw new Error("error data type or be not empty");
        }
        console.log(SerialNumber);
    }

});
console.log(hddSerialNumber.first());
//check if serial exist on hdds serials array;
//used this function to test .first and .check functions works properly
hddSerialNumber.first(function (error,SerialNumber) {

    if(error){
        throw new Error(error);
    }else{
        /*start check*/
        hddSerialNumber.check(SerialNumber,function (error, success) {
           if(success){
               console.log('success');
           }else{
               throw new Error("error");
           }
       })
       /*end check*/
    }

});
//check if serial exist and is it first hdd serial (operating system hdd serial);
//used this function to test .first and .isfirst functions works properly
 hddSerialNumber.first(function (error,SerialNumber) {

    if(error){
        throw new Error(error);
    }else{
        /*start check*/
        hddSerialNumber.isfirst(SerialNumber,function (error, success) {
            if(success){
                console.log('success');
            }else{
                throw new Error("error");
            }
        })
        /*end check*/
    }

});


