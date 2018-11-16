
const fs = require('fs');
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const gRPC = require('./node_modules/grpc');
const config_tmp = require("./config.json")

// Creates a client
const client = new textToSpeech.TextToSpeechClient({
  projectId: "texttospeecheg",
   credentials: {
       private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDFhmEBIAtN+FCf\nQocNwCiEuYlVZd6c4Smg6HlXC5TeuD0+33N8Z5UxO2hS8MTlHaaLdYfrbZkOhvMc\npIN73bjP5pl7Rg3jyaV3h0hih6nax21BbC6Mo3u4HTHnOzACxgzi1XJD90fs8WfM\n0tb2MoR5PVN41Uir3iJjMtdavOeojM1NbyBrFlIIEkevD71Cn9pf7cxrZs4h3Ifi\ntgu8Ir7Cih8sz6uJgoUyIA6ZZghRsq3PJYiT7z1rJhq/tK+QoD2Q4T6RBb7Pd6x9\ncVKUZawoHB2Zs3TPVAVQ5rFzuyqmiclPPJ3l0+TSRBhFnqpNcbI3q0a9C6TfxFoS\nrDqnBplzAgMBAAECggEAAoPIg58O0fpCf48+gwgdddn8lPVHiqnfBMLbm6xiXClD\nwimjp8/RCKLzwJhKPUJsPN9xuDm05EtQTyf/hO2gTTVPPfsFG/cg+Zss8Kc/CeKB\nDzYsJbyFlLdb9m7tbdcKJEsVG1fX26GmCee7wsvQJCYQBGD1EC+tPrArHSo/S3a0\nZI8a+V03/8VVSt4xT4NVuqTw8JUMNrH4qHLH306oSftV0bYH03xChjMi32u8Xy/O\nk2Hg/vJg58Dx0wfFQDdiBblvk6kesQKdfY8LLldsmqL7QX6zNGuWFRua2YrcVwa3\nIV+o+9kEsjzkaP9Iul2PdCvq1yJXO3H38FaD5M5gsQKBgQDimR6OLiMsYM2VjqHp\noS5WhNFV49xL/7dun/kFE3Wi3Jj1qGdPWmjHwVXGTlcMUbBt0grpnGBwEnb7Flkc\nnmO+qVCFPweWAjJLTx8SZW/O3clqat08h7QoRMieXzygeX77SH+8+aoaMT30lTWa\noMwZEgx3/9lJgxyioonAkK8n5wKBgQDfJ4nmGkst0t2SekssyOXAq4KR4UBlG9XC\nWOneXb0Zezo+u0zrBAhSWlYQsPBO4NWOosLX/FZdTdS2taNAyFCsFxkMBzzgD8Fx\nI+4l/G2NpWJWLKEstyZbW9bKLHxEdiY5U1hPJZSostQeqvtG3MWmaFkguvbW4kMn\nUQ0LsjyglQKBgQDcjCHkSt2rNPEEDtZimaGLTiydh3EEe3ji8EskeKM3h7RM7cLX\nxmxTeEZvBBLPh7bLvPMoGy72BdLOYhsLstHsYclgV0+f3rVq/TCF7DrdwppmvGpm\nnsJnq0MEejd9DaPdGdxSZ0H7yk+9/Xg17ymXgSyno1qupTE6zi57QZdpowKBgQDF\n632FFmEDXXijh8/RAsWzouqFlDDW/F8UpmOWk7E6Pm8kYF8SOltfHzwiRax9aTA/\n99+0TNwUmQlGm8cVmBTk7P+MCYdWeuLpBCMekcpgzQRwxdiVnkNo2AWi/t2gouG4\nClHSsNQu45z7Lk77RKgQtZAHVYvEfp1s65gUfZsEGQKBgQDbKjs2+rZIB2ua6Drg\n8/EI0V28Q15yDNimEbDp+gtttmmyl/MHOqGx2qYdAENF8G7WIKXQ7gS3VywgKgsN\nah041vBzCDSfrQp4BGdClAPgma676V0+z/Vm+4DVMfQQChj382i3fOsXFRjeHpMg\nO9xLzQhBWkfpaTP8XHdxfJ+ekQ==\n-----END PRIVATE KEY-----\n",
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
