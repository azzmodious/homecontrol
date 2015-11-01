////////////////////////////////////////////////////////
// Use the cool library                               //
// git://github.com/voodootikigod/node-serialport.git //
// to read the serial port where arduino is sitting.  //
////////////////////////////////////////////////////////               
var com = require("serialport");
var request = require("request");

var globalData = {};
var serialPort = new com.SerialPort("/dev/cu.usbmodem1421", {
    baudrate: 9600,
    parser: com.parsers.readline('\r\n')
  });

serialPort.on('open',function() {
  console.log('Port open');
});

var writeData = function()
{
    console.info("writing data");
    request.post(
     "http://192.168.200.105:2403/sensor-data/",globalData, 
     function(error, response, body){
        if(!error && response.statusCode == 200){
            console.info("id:"+response.body);
        }
         else{
            console.error(response.body);
         }
     });   
}

var envelopData = function(data){
    var date = new Date();
    var entry = {};
    entry.sensor = "leo01";
    entry.date = date.getFullYear()+"."+date.getMonth()+"."+date.getDate();
    entry.time = date.getTime();
    entry.data = data;

    var f = {};
    f.form = entry;
    return f;
}

serialPort.on('data', function(data) {
 var d = JSON.parse(data);

 globalData = envelopData(d);
  //console.log(globalData);
});

setInterval(writeData, 1000*10);
