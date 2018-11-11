const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const config = require("./config.json")

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './apikey.json'
});

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear();
   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
   return "".concat(yyyy+"y ").concat(mm+"m ").concat(dd+ "d ");
  };

 Date.prototype.yyyymmddhhmm = function() {
   var yyyymmdd = this.yyyymmdd();
   var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
   var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
   return "".concat(yyyymmdd).concat(hh+"h ").concat(min+" min");
  };

 Date.prototype.yyyymmddhhmmss = function() {
   var yyyymmddhhmm = this.yyyymmddhhmm();
   var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
   return "".concat(yyyymmddhhmm).concat(ss+ "sec");
  };




const ssml = fs.readFileSync('./text.txt', 'utf8')
const outputFile = './audio/'+ config.name + makeid() + '.mp3';

const request = {
  input: {ssml: ssml},
  voice: {languageCode: config.sprache, ssmlGender: config.geschlecht},
  audioConfig: {audioEncoding: 'MP3'},
};

client.synthesizeSpeech(request, (err, response) => {
  if (err) {
    console.error('ERROR:XDDDD', err);
    return;
  }

  fs.writeFile(outputFile, response.audioContent, 'binary', err => {
    if (err) {
      console.error('ERROR:FCK ERROR', err);
      return;
    }
    console.log(`Audio content written to file: ${outputFile}`);
  });
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var d = new Date();
  var res = d.yyyymmddhhmmss();


  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return res+" "+text;
}
