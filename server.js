var Nexmo = require('nexmo');

var nexmo = new Nexmo({
  apiKey: '15d84ce8',
  apiSecret: '8bf4f92533630be6',
});

var from = 'Nexmo';
var to = '821046457084';
var text = 'A text message sent using the Nexmo SMS API';

nexmo.message.sendSms(from, to, text);