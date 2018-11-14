const textToSpeech = require('@google-cloud/text-to-speech', (err) => {
  console.log(err);
  setTimeout(function() {
    debugger;
  }, 5000)
});
const fs = require('fs');
const pkg = require("./package.json");
const config_tmp = require("./config.json")

const client = new textToSpeech.TextToSpeechClient({
  projectId: "texttospeecheg",
  credentials: {
    private_key: "yourkey"
    client_email: "mainmakisuo@texttospeecheg.iam.gserviceaccount.com"
  }
});

if (!fs.existsSync("config.json")) {
  fs.writeFileSync("./config.json", JSON.stringify(config_tmp, null, 2))
}

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

if (!fs.existsSync("audio")) {
  fs.mkdirSync("audio");
}

if (!fs.existsSync("text.txt")) {
  fs.writeFileSync("./text.txt");
  return;
}

Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear();
  var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
  var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
  return "".concat(yyyy + "_").concat(mm + "m ").concat(dd + "d ");
};

Date.prototype.yyyymmddhhmm = function() {
  var yyyymmdd = this.yyyymmdd();
  var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
  var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
  return "".concat(yyyymmdd).concat(hh + "h ").concat(min + " min");
};

Date.prototype.yyyymmddhhmmss = function() {
  var yyyymmddhhmm = this.yyyymmddhhmm();
  var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
  return "".concat(yyyymmddhhmm).concat(ss + "sec");
};




const ssml = fs.readFileSync('text.txt', 'utf8')
console.log(ssml);
const outputFile = 'audio/' + config.name + " " + makeid() + '.mp3';

const request = {
  input: {
    ssml: ssml
  },
  voice: {
    languageCode: config.language,
    ssmlGender: config.gender
  },
  audioConfig: {
    audioEncoding: 'MP3'
  },
};

client.synthesizeSpeech(request, (err, response) => {
  if (err) {
    console.error('ERROR:', err);
    return;
  }

  fs.writeFile(outputFile, response.audioContent, 'binary', err => {
    if (err) {
      console.error('ERROR:', err);
      return;
    }
    console.log(`Audio content written to file: ${outputFile}`);
  });
});

function makeid() {
  var d = new Date();
  var res = d.yyyymmddhhmmss();
  return res;
}
