const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const config = require("./config.json")

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './apikey.json'
});


const ssml = fs.readFileSync('./text.txt', 'utf8')
const outputFile = './audio/'+ makeid() + '.mp3';

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
      console.error('ERROR:', err);
      return;
    }
    console.log(`Audio content written to file: ${outputFile}`);
  });
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
