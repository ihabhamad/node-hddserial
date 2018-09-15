[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fihabhamad%2Fnode-hddserial.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fihabhamad%2Fnode-hddserial?ref=badge_shield)

Retrieve hdd serial number in Linux,Windows,MacOS.

**Features:**
-----
works on `Linux`,`Windows`,`MacOS`

Testing
-----
Windows : [windows 7,windows 10,Server 2008,2012]

Linux   : [ubuntu 16.10,CentOS 7.5]

MacOS   : [MacOS Sierra 10.12]

Usage
-----

```BASH
npm install --save hddserial
```

```JavaScript
var hddserial = require('hddserial');
```
Note
--------------
hddserial library get a Serial Number from Physical Hard disk drives not logical or volume 
    
Examples
--------------
     
    .one(hdd-index, callback) → string //hdd-index numaric value 0 equals first hdd on pc or os hdd you can use .first
    .first(callback) → string  
    .all(callback)        → { array of strings index of array = index of hdd }
    .check('Serial Number',callback)  → boolean true if exist
    .isfirst('Serial Number',callback)  → boolean true if is exist and is first

---
Retrieves the HDD Serial Number for index 1 or second HDD {sdb on linux}.

```
indexes begin from 0
0 : first  HDD
1 : socend HDD
2 : therd  HDD
```
```JavaScript
hddserial.one(1,function (err, serial) {
  console.log("hdd serial for first hdd : %s", serial);  
});
```
Output String
```
→ hdd serial for hdd with index 1 : N31FNPH8
```
Retrieves the HDD Serial Number  for index 0 or first HDD {sda on linux}.
```JavaScript
hddserial.first(function (err, serial) {
  console.log("hdd serial for first hdd : %s", serial);  
});
```
Output String
```
→ hdd serial for first hdd : 5L09TDHA
```
Retrieves all HDDs Serial Numbers {sda,sdb,sdc on linux}.

```JavaScript
hddserial.all(function (err, serial) {
  console.log(serial);
});
```
Output array
```JavaScript
['5L09TDHA','N31FNPH8','6YD3W4E9']
```
check the Serial Number founded is first serial.

```JavaScript
hddserial.isfirst('5L09TDHA',function (err, success) {
  if(success){
      console.log("true Serial 5L09TDHA is first");
  }else{
      console.log("false Serial 5L09TDHA is not a first");
  }
});
```
check if Serial Number founded in your system.
```JavaScript
hddserial.check('5L09TDHA',function (err, success) {
  if(success){
      console.log("true Serial 5L09TDHA founded !!");
  }else{
      console.log("false Serial 5L09TDHA is not a found in all hdds");
  }
});
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fihabhamad%2Fnode-hddserial.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fihabhamad%2Fnode-hddserial?ref=badge_large)