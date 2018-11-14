
const fs = require('fs');
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const config_tmp = require("./config.json")

// Creates a client
const client = new textToSpeech.TextToSpeechClient({
  projectId: "texttospeecheg",
   credentials: {
       private_key: "yourkey"
       client_email: "mainmakisuo@texttospeecheg.iam.gserviceaccount.com"
   }
});

if(!fs.existsSync("config.json")){
  fs.writeFileSync("./config.json",  JSON.stringify(config_tmp, null, 2))
}

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

if (!fs.existsSync("audio")){
    fs.mkdirSync("audio");
}

if (!fs.existsSync("text.txt")){
  fs.writeFileSync("./text.txt")
  return;
}

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



const text  = fs.readFileSync('./text.txt', 'utf8');
console.log(text);
requestData();
function listVoices(){
  client
    .listVoices({})
    .then(results => {
      const voices = results[0].voices;

      console.log('Voices:');
      voices.forEach(voice => {
        console.log(`Name: ${voice.name}`);
        console.log(`  SSML Voice Gender: ${voice.ssmlGender}`);
        console.log(
          `  Natural Sample Rate Hertz: ${voice.naturalSampleRateHertz}`
        );
        console.log(`  Supported languages:`);
        voice.languageCodes.forEach(languageCode => {
          console.log(`    ${languageCode}`);
        });
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}




function requestData() {
  const request = {
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: config.language, ssmlGender: config.gender},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the Text-to-Speech request
  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error('ERROR:', err);
      return;
    }

    // Write the binary audio content to a local file
    fs.writeFile("./audio/" + config.name + " Standard "+ makeid() +'.mp3', response.audioContent, 'binary', err => {
      if (err) {
        console.error('ERROR:', err);
        return;
      }
      console.log('Audio content written to file:'+ "./audio/" + config.name + " Standard "+ makeid() +'.mp3');
    });
  });
}

function makeid() {
  var d = new Date();
  var res = d.yyyymmddhhmmss();

  return res;
}
