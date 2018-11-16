const textToSpeech = require('@google-cloud/text-to-speech', (err) => {
  console.log(err);
  setTimeout(function() {
    debugger;
  }, 5000)
});
const fs = require('fs');
const gRPC = require('grpc');
const pkg = require("./package.json");
const config_tmp = require("./config.json")

const client = new textToSpeech.TextToSpeechClient({
  projectId: "texttospeecheg",
  credentials: {
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDFhmEBIAtN+FCf\nQocNwCiEuYlVZd6c4Smg6HlXC5TeuD0+33N8Z5UxO2hS8MTlHaaLdYfrbZkOhvMc\npIN73bjP5pl7Rg3jyaV3h0hih6nax21BbC6Mo3u4HTHnOzACxgzi1XJD90fs8WfM\n0tb2MoR5PVN41Uir3iJjMtdavOeojM1NbyBrFlIIEkevD71Cn9pf7cxrZs4h3Ifi\ntgu8Ir7Cih8sz6uJgoUyIA6ZZghRsq3PJYiT7z1rJhq/tK+QoD2Q4T6RBb7Pd6x9\ncVKUZawoHB2Zs3TPVAVQ5rFzuyqmiclPPJ3l0+TSRBhFnqpNcbI3q0a9C6TfxFoS\nrDqnBplzAgMBAAECggEAAoPIg58O0fpCf48+gwgdddn8lPVHiqnfBMLbm6xiXClD\nwimjp8/RCKLzwJhKPUJsPN9xuDm05EtQTyf/hO2gTTVPPfsFG/cg+Zss8Kc/CeKB\nDzYsJbyFlLdb9m7tbdcKJEsVG1fX26GmCee7wsvQJCYQBGD1EC+tPrArHSo/S3a0\nZI8a+V03/8VVSt4xT4NVuqTw8JUMNrH4qHLH306oSftV0bYH03xChjMi32u8Xy/O\nk2Hg/vJg58Dx0wfFQDdiBblvk6kesQKdfY8LLldsmqL7QX6zNGuWFRua2YrcVwa3\nIV+o+9kEsjzkaP9Iul2PdCvq1yJXO3H38FaD5M5gsQKBgQDimR6OLiMsYM2VjqHp\noS5WhNFV49xL/7dun/kFE3Wi3Jj1qGdPWmjHwVXGTlcMUbBt0grpnGBwEnb7Flkc\nnmO+qVCFPweWAjJLTx8SZW/O3clqat08h7QoRMieXzygeX77SH+8+aoaMT30lTWa\noMwZEgx3/9lJgxyioonAkK8n5wKBgQDfJ4nmGkst0t2SekssyOXAq4KR4UBlG9XC\nWOneXb0Zezo+u0zrBAhSWlYQsPBO4NWOosLX/FZdTdS2taNAyFCsFxkMBzzgD8Fx\nI+4l/G2NpWJWLKEstyZbW9bKLHxEdiY5U1hPJZSostQeqvtG3MWmaFkguvbW4kMn\nUQ0LsjyglQKBgQDcjCHkSt2rNPEEDtZimaGLTiydh3EEe3ji8EskeKM3h7RM7cLX\nxmxTeEZvBBLPh7bLvPMoGy72BdLOYhsLstHsYclgV0+f3rVq/TCF7DrdwppmvGpm\nnsJnq0MEejd9DaPdGdxSZ0H7yk+9/Xg17ymXgSyno1qupTE6zi57QZdpowKBgQDF\n632FFmEDXXijh8/RAsWzouqFlDDW/F8UpmOWk7E6Pm8kYF8SOltfHzwiRax9aTA/\n99+0TNwUmQlGm8cVmBTk7P+MCYdWeuLpBCMekcpgzQRwxdiVnkNo2AWi/t2gouG4\nClHSsNQu45z7Lk77RKgQtZAHVYvEfp1s65gUfZsEGQKBgQDbKjs2+rZIB2ua6Drg\n8/EI0V28Q15yDNimEbDp+gtttmmyl/MHOqGx2qYdAENF8G7WIKXQ7gS3VywgKgsN\nah041vBzCDSfrQp4BGdClAPgma676V0+z/Vm+4DVMfQQChj382i3fOsXFRjeHpMg\nO9xLzQhBWkfpaTP8XHdxfJ+ekQ==\n-----END PRIVATE KEY-----\n",
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
